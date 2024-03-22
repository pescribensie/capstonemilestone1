from werkzeug.security import generate_password_hash

def hash_password():
    password = input("Enter the password to hash: ")
    hashed_password = generate_password_hash(password)
    print("Hashed password:", hashed_password)

if __name__ == "__main__":
    hash_password()


scrypt:32768:8:1$fq5NpHkotLjm9him$1b6761380b76805ffd3eb68e6dcbc0f6eb0cfa2bd09d5fef6996ea04089c13b53f3cf006a2667f4ce54aa284b20f1fcd03bf00207fdb139443bf4a21651cc3be
