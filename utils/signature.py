import datetime
import sys
from datetime import timezone
import PyKCS11
from endesive import pdf, hsm
import time
import io
from PyPDF2 import PdfReader, PdfWriter
if sys.platform == 'win32':
    DLL_PATH = r'C:/Windows/System32/SignatureP11.dll'
else:
    DLL_PATH = '/usr/lib/WatchData/ProxKey/lib/libwdpkcs_SignatureP11.so'


class PDFSigner(hsm.HSM):
    def __init__(self, dll_path):
        super().__init__(dll_path)
        self.dll_path = dll_path
        self.pkcs11 = PyKCS11.PyKCS11Lib()
        self.pkcs11.load(self.dll_path)
        self.session = None

    def list_tokens(self):
        tokens = []
        slots = self.pkcs11.getSlotList(tokenPresent=True)
        for slot in slots:
            token_info = self.pkcs11.getTokenInfo(slot)
            tokens.append((slot, token_info.label.strip()))
        return tokens

    def open_session(self, slot):
        if self.session:
            self.session.closeSession()
        self.session = self.pkcs11.openSession(
            slot, PyKCS11.CKF_SERIAL_SESSION | PyKCS11.CKF_RW_SESSION)

    def login(self, pin):
        if self.session:
            self.session.login(pin, PyKCS11.CKU_USER)

    def logout_and_close(self):
        if self.session:
            self.session.logout()
            self.session.closeSession()
            self.session = None

    def certificate(self):
        if not self.session:
            raise Exception("Session not initialized.")
        pk11objects = self.session.findObjects(
            [(PyKCS11.CKA_CLASS, PyKCS11.CKO_CERTIFICATE)])
        for pk11object in pk11objects:
            attributes = self.session.getAttributeValue(
                pk11object, [PyKCS11.CKA_VALUE, PyKCS11.CKA_ID])
            if attributes:
                # cert_id, cert_value
                return attributes[1], bytes(attributes[0])
        return None, None

    def sign(self, keyid, data, mech):
        mechanism = PyKCS11.Mechanism(PyKCS11.CKM_SHA256_RSA_PKCS, None)
        if mech == 'sha512':
            mechanism = PyKCS11.Mechanism(PyKCS11.CKM_SHA512_RSA_PKCS, None)
        elif mech == 'sha384':
            mechanism = PyKCS11.Mechanism(PyKCS11.CKM_SHA384_RSA_PKCS, None)
        elif mech == 'sha1':
            mechanism = PyKCS11.Mechanism(PyKCS11.CKM_SHA1_RSA_PKCS, None)

        private_key = self.session.findObjects([
            (PyKCS11.CKA_CLASS, PyKCS11.CKO_PRIVATE_KEY),
            (PyKCS11.CKA_ID, keyid)
        ])[0]  # Get the private key object
        return bytes(self.session.sign(private_key, data, mechanism))

    def sign_pdf(self, slot, input_file, output_file, pin):
        self.open_session(slot)
        self.login(pin)

        # Read the original PDF
        reader = PdfReader(input_file)
        writer = PdfWriter()

        # Copy the original PDF to the writer
        for page in reader.pages:
            writer.add_page(page)

        # Create a BytesIO buffer to store the PDF data
        pdf_buffer = io.BytesIO()
        writer.write(pdf_buffer)
        pdf_buffer.seek(0)  # Go to the start of the buffer

        # Get the raw PDF bytes
        pdf_data = pdf_buffer.read()

        date = datetime.datetime.now(
            timezone.utc).strftime('%Y%m%d%H%M%S+00\'00\'')

        # First signature dictionary for the first page
        dct = {
            "sigflags": 3,
            "sigpage": 0,  # Ensure signature appears on the selected page
            "sigbutton": True,
            "sigfield": "Signature1",  # Unique signature field per page
            "contact": "contact@example.com",
            "location": "Pune, Maharashtra",
            "reason": 'Document Approval',
            "signingdate": date.encode(),
            "signature": 'Signed By : PRATAP SHAMRAO KHANDEKAR',
            "signaturebox": (0, 0, 100, 70),  # x1, y1, width, height
        }

        # Get certificate and private key id for signing
        keyid, cert = self.certificate()
        if not cert:
            raise Exception("Certificate could not be retrieved.")

        # First signature
        cms_signature = pdf.cms.sign(
            pdf_data, dct, cert, keyid, [], 'sha256', self)

        # Save the PDF with the first signature to an output file
        with open(output_file, 'wb') as f_out:
            f_out.write(pdf_data)  # Write the original PDF data
            f_out.write(cms_signature)  # Append the first signature

        # Re-read the signed PDF to apply the second signature
        with open(output_file, 'rb') as f_in:
            signed_pdf_data = f_in.read()

        # Second signature dictionary for the second page
        dct2 = {
            "sigflags": 3,
            "sigpage": 1,  # Ensure signature appears on the second page
            "sigbutton": True,
            "sigfield": "Signature2",  # Unique signature field per page
            "contact": "contact@example.com",
            "location": "Pune, Maharashtra",
            "reason": 'Document Approval',
            "signingdate": date.encode(),
            "signature": 'Signed By : PRATAP SHAMRAO KHANDEKAR',
            "signaturebox": (0, 0, 100, 70),  # x1, y1, width, height
        }

        # Second signature, applied as an incremental update
        cms_signature2 = pdf.cms.sign(
            signed_pdf_data, dct2, cert, keyid, [], 'sha256', self)

        # Append the second signature to the PDF
        with open(output_file, 'ab') as f_out:
            f_out.write(cms_signature2)

        self.logout_and_close()


def main():
    signer = PDFSigner(DLL_PATH)
    tokens = signer.list_tokens()
    if not tokens:
        print("No tokens found.")
        return

    for i, (slot, label) in enumerate(tokens):
        print(f"{i + 1}: {label}")
    selected = int(input("Select a token: ")) - 1
    pin = input("Enter PIN for the selected token: ")

    # Modify the input to specify how many pages to sign (default 2)
    signer.sign_pdf(tokens[selected][0], 'input.pdf',
                    'output.pdf', pin)


if __name__ == '__main__':
    main()
