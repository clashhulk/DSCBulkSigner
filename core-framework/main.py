import sys
import functions  # Import the whole module


def dispatch_operation(operation_name, *args):
    try:
        # Dynamically get the function from the functions module
        func = getattr(functions, operation_name)
    except AttributeError:
        return json.dumps({"status": "error", "message": "Unknown operation"})

    # Execute the function with the provided arguments
    try:
        response = func(*args)  # Pass arguments as they are
        return response
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


if __name__ == "__main__":
    operation_name = sys.argv[1]
    args = sys.argv[2:]
    result = dispatch_operation(operation_name, *args)
    print(result)  # Directly print the JSON response from the function
