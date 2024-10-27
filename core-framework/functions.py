import json
import PyKCS11


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
