const { execSync } = require("child_process");
const fs = require("fs");

try {
  execSync(
    "openssl ecparam -name secp256k1 -genkey -noout -out PrivateKey.pem"
  );

  execSync(
    "openssl req -new -sha256 -key PrivateKey.pem -extensions v3_req -config config_csr.cnf -out taxpayer.csr"
  );

  // encode csr to base64
  const csr = fs.readFileSync("taxpayer.csr").toString("base64");
  fs.writeFileSync("taxpayer_base64.csr", csr);
} catch (error) {
  console.error(error);
}
