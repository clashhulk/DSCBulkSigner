import json
import PyKCS11
import warnings
from cryptography.utils import CryptographyDeprecationWarning
from datetime import datetime
from cryptography import x509
from cryptography.hazmat.backends import default_backend
warnings.filterwarnings("ignore", category=CryptographyDeprecationWarning)


class PDFSigner:
    def __init__(self, dll_path):
        self.dll_path = dll_path
        self.pkcs11 = PyKCS11.PyKCS11Lib()
        self.pkcs11.load(self.dll_path)
        self.session = None

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

    def get_certificate_info(self):
        if not self.session:
            return {"status": "error", "message": "Session not initialized."}

        try:
            pk11objects = self.session.findObjects(
                [(PyKCS11.CKA_CLASS, PyKCS11.CKO_CERTIFICATE)])
            cert_info = []

            for pk11object in pk11objects:
                attributes = self.session.getAttributeValue(
                    pk11object,
                    [
                        PyKCS11.CKA_LABEL,
                        PyKCS11.CKA_SERIAL_NUMBER,
                        PyKCS11.CKA_VALUE
                    ]
                )

                label = attributes[0].strip() if attributes[0] else ""
                serial_number = ''.join(
                    f'{num:02X}' for num in attributes[1]) if attributes[1] else ""

                # Decode the full certificate to get subject and issuer
                cert_value = bytes(attributes[2]) if attributes[2] else None
                subject = issuer = ""
                validity_period = {}

                if cert_value:
                    try:
                        # Load the full certificate to extract subject and issuer
                        cert = x509.load_der_x509_certificate(
                            cert_value, default_backend())
                        subject = cert.subject.rfc4514_string()
                        issuer = cert.issuer.rfc4514_string()
                        validity_period = {
                            "not_before": cert.not_valid_before.isoformat(),
                            "not_after": cert.not_valid_after.isoformat()
                        }
                    except Exception as e:
                        subject = f"Error decoding subject: {e}"
                        issuer = f"Error decoding issuer: {e}"

                cert_info.append({
                    "label": label,
                    "serial_number": serial_number,
                    "subject": subject,
                    "issuer": issuer,
                    "validity": validity_period
                })

            return {"status": "success", "data": cert_info}

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_dsc_info(self, slot, pin):
        try:
            self.open_session(slot)
            self.login(pin)
            cert_info = self.get_certificate_info()
            self.logout_and_close()
            return json.dumps(cert_info)

        except Exception as e:
            self.logout_and_close()
            return json.dumps({"status": "error", "message": str(e)})

# Function to be called by `dispatch_operation`


def get_dsc_info(dll_path, slot, pin):
    signer = PDFSigner(dll_path)
    return signer.get_dsc_info(int(slot), pin)


def listConnectedDsc(dll_path):
    pkcs11 = PyKCS11.PyKCS11Lib()
    pkcs11.load(dll_path)
    slots = pkcs11.getSlotList(tokenPresent=True)
    tokens = []
    for slot in slots:
        token_info = pkcs11.getTokenInfo(slot)
        tokens.append((slot, token_info.label.strip()))
    response = {"status": "success", "data": tokens}
    return json.dumps(response)

# def listConnectedDsc(dll_path):
#     # Simulate some logic to list DSCs
#     response = {"status": "success", "data": [
#         f"DSC at {dll_path}", "DSC 2", "DSC 3"]}
#     return json.dumps(response)


def add(a, b):
    # Convert arguments to integers inside the function
    result = int(a) + int(b)
    return json.dumps({"status": "success", "result": result})


def multiply(a, b):
    # Convert arguments to integers inside the function
    result = int(a) * int(b)
    return json.dumps({"status": "success", "result": result})
