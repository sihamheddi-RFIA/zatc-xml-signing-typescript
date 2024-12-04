import { EGS, EGSUnitInfo } from "zatca-xml-js/lib/zatca/egs/index";
import { ZATCASimplifiedInvoiceLineItem } from "zatca-xml-js/lib/zatca/templates/simplified_tax_invoice_template";
import { ZATCASimplifiedTaxInvoice } from "zatca-xml-js/lib/zatca/ZATCASimplifiedTaxInvoice";
import * as fs from "fs";

// Sample line item
const line_item: ZATCASimplifiedInvoiceLineItem = {
  id: "1",
  name: "TEST NAME",
  quantity: 5,
  tax_exclusive_price: 10,
  VAT_percent: 0.15,
};

const privateKey = fs.readFileSync("ec-secp256k1-priv-key.pem").toString();
const compliance_certificate = fs.readFileSync("cert.pem").toString();
//const csr = fs.readFileSync("taxpayer.csr").toString();

// Sample EGSUnit
const egsunit: EGSUnitInfo = {
  uuid: "FC15EB04-B224-48C5-9A8B-D242DF52E8EE",
  custom_id: "EGS1-886431145",
  private_key: privateKey,
  compliance_certificate,
  // compliance_api_secret: secret,
  model: "IOS",
  CRN_number: "1010275998",
  VAT_name: "شركة فوال قمم الطائف",
  VAT_number: "310161085400003",
  location: {
    city: "Riyadh",
    city_subdivision: "Riyadh",
    street: "King Abdulaziz",
    plot_identification: "7180",
    building: "5464",
    postal_zone: "13713",
  },
  branch_name: "شركة فوال قمم الطائف",
  branch_industry: "RESTAURANT",
};

// Sample Invoice
const invoice = new ZATCASimplifiedTaxInvoice({
  props: {
    egs_info: egsunit,
    invoice_counter_number: 699,
    invoice_serial_number: "699",
    issue_date: "2024-11-02",
    issue_time: "05:54:45",
    line_items: [line_item],
  },
});

const main = async () => {
  try {
    // Init a new EGS
    const egs = new EGS(egsunit);
    const x: any = invoice.getXML();

    const { signed_invoice_string, invoice_hash, qr } =
      egs.signInvoice(invoice);

    fs.writeFileSync("signed_invoice.xml", signed_invoice_string);

    // console.log(signed_invoice_string);
  } catch (error: any) {
    console.log(error);
  }
};

main();
