/* ============================================================
   AYUSHMAN BILLING
   COMPLETE APPLICATION JAVASCRIPT

   File:
   D:\AYUSHMAN BILLING\static\js\app.js

   FEATURES
   ------------------------------------------------------------
   • Patient information
   • Two-column patient layout
   • Editable billing table
   • Text / numbers / symbols in every billing field
   • Add billing rows
   • Delete billing rows
   • Editable billing totals
   • Manual totals are NOT overwritten automatically
   • Clear button
   • New Bill button
   • Print / Save PDF
   • Bottom action buttons
   • Package data loading
   • Keyboard-friendly operation
============================================================ */


/* ============================================================
   GLOBAL APPLICATION STATE
============================================================ */

let billingRowNumber = 0;


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    initializeApplication();

});


/* ============================================================
   INITIALIZE APPLICATION
============================================================ */

function initializeApplication() {

    bindButtons();

    initializeExistingRows();

    /*
       If there are no rows, create one empty row.
    */

    const billingBody =
        document.getElementById("billingBody");

    if (
        billingBody &&
        billingBody.children.length === 0
    ) {

        addBillingRow();

    }

}


/* ============================================================
   BUTTON BINDINGS
============================================================ */

function bindButtons() {

    /* --------------------------------------------------------
       TOP ADD ROW
    -------------------------------------------------------- */

    const addRowBtn =
        document.getElementById("addRowBtn");

    if (addRowBtn) {

        addRowBtn.addEventListener(
            "click",
            function () {

                addBillingRow();

            }
        );

    }


    /* --------------------------------------------------------
       BILLING SECTION ADD ROW
    -------------------------------------------------------- */

    const addBillingRowBtn =
        document.getElementById(
            "addBillingRowBtn"
        );

    if (addBillingRowBtn) {

        addBillingRowBtn.addEventListener(
            "click",
            function () {

                addBillingRow();

            }
        );

    }


    /* --------------------------------------------------------
       BOTTOM ADD ROW
    -------------------------------------------------------- */

    const addBottomRowBtn =
        document.getElementById(
            "addBottomRowBtn"
        );

    if (addBottomRowBtn) {

        addBottomRowBtn.addEventListener(
            "click",
            function () {

                addBillingRow();

            }
        );

    }


    /* --------------------------------------------------------
       TOP PRINT
    -------------------------------------------------------- */

    const printBtn =
        document.getElementById("printBtn");

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            function () {

                printBill();

            }
        );

    }


    /* --------------------------------------------------------
       BOTTOM PRINT
    -------------------------------------------------------- */

    const bottomPrintBtn =
        document.getElementById(
            "bottomPrintBtn"
        );

    if (bottomPrintBtn) {

        bottomPrintBtn.addEventListener(
            "click",
            function () {

                printBill();

            }
        );

    }


    /* --------------------------------------------------------
       CLEAR
    -------------------------------------------------------- */

    const clearBtn =
        document.getElementById("clearBtn");

    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            function () {

                clearBill();

            }
        );

    }


    /* --------------------------------------------------------
       NEW BILL
    -------------------------------------------------------- */

    const newBillBtn =
        document.getElementById("newBillBtn");

    if (newBillBtn) {

        newBillBtn.addEventListener(
            "click",
            function () {

                newBill();

            }
        );

    }

}


/* ============================================================
   ADD BILLING ROW
============================================================ */

function addBillingRow(data = {}) {

    const billingBody =
        document.getElementById("billingBody");

    if (!billingBody) {
        return;
    }


    billingRowNumber++;


    const row =
        document.createElement("tr");

    row.className =
        "billing-row";


    row.dataset.row =
        billingRowNumber;


    /* ========================================================
       CELL CREATOR
    ======================================================== */

    function createInputCell(
        value = "",
        placeholder = ""
    ) {

        const td =
            document.createElement("td");


        const input =
            document.createElement("input");


        /*
           TEXT is intentionally used.

           This allows:

           10000
           ₹10,000
           ₹10,000/-
           N/A
           APPROVED
           ABC-123
           10%
           SPECIAL
           Any text
           Any symbols
        */

        input.type =
            "text";


        input.value =
            value ?? "";


        input.placeholder =
            placeholder;


        input.autocomplete =
            "off";


        input.spellcheck =
            false;


        td.appendChild(input);


        return td;

    }


    /* ========================================================
       # COLUMN
    ======================================================== */

    const numberCell =
        document.createElement("td");


    numberCell.className =
        "row-number";


    numberCell.textContent =
        billingRowNumber;


    row.appendChild(numberCell);


    /* ========================================================
       PACKAGE CODE
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.packageCode || "",
            "Package Code"
        )
    );


    /* ========================================================
       PACKAGE TYPE
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.packageType || "",
            "Package Type"
        )
    );


    /* ========================================================
       PROCEDURE COST
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.procedureCost || "",
            "Procedure Cost"
        )
    );


    /* ========================================================
       STRATIFICATION COST
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.stratificationCost || "",
            "Stratification Cost"
        )
    );


    /* ========================================================
       QTY
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.qty || "",
            "Qty"
        )
    );


    /* ========================================================
       PACKAGE COST
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.packageCost || "",
            "Package Cost"
        )
    );


    /* ========================================================
       ADJUSTMENT FACTOR
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.adjustmentFactor || "",
            "Adj. Factor"
        )
    );


    /* ========================================================
       INCENTIVES
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.incentives || "",
            "Incentives"
        )
    );


    /* ========================================================
       TOTAL AMOUNT
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.totalAmount || "",
            "Total Amount"
        )
    );


    /* ========================================================
       REMARKS
    ======================================================== */

    row.appendChild(
        createInputCell(
            data.remarks || "",
            "Remarks"
        )
    );


    /* ========================================================
       ACTION
    ======================================================== */

    const actionCell =
        document.createElement("td");


    actionCell.className =
        "action-column";


    const deleteButton =
        document.createElement("button");


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-row";


    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteBillingRow(row);

        }
    );


    actionCell.appendChild(
        deleteButton
    );


    row.appendChild(
        actionCell
    );


    /* ========================================================
       ADD ROW TO TABLE
    ======================================================== */

    billingBody.appendChild(
        row
    );


    /*
       Put cursor into the first editable field.
    */

    const firstInput =
        row.querySelector(
            "input"
        );


    if (firstInput) {

        setTimeout(
            function () {

                firstInput.focus();

            },
            20
        );

    }


    updateRowNumbers();

}


/* ============================================================
   DELETE BILLING ROW
============================================================ */

function deleteBillingRow(row) {

    if (!row) {
        return;
    }


    const billingBody =
        document.getElementById(
            "billingBody"
        );


    if (!billingBody) {
        return;
    }


    /*
       If only one row exists,
       don't leave the table completely empty.
    */

    if (
        billingBody.children.length <= 1
    ) {

        const inputs =
            row.querySelectorAll(
                "input"
            );


        inputs.forEach(
            function (input) {

                input.value = "";

            }
        );


        return;

    }


    row.remove();


    updateRowNumbers();

}


/* ============================================================
   UPDATE ROW NUMBERS
============================================================ */

function updateRowNumbers() {

    const rows =
        document.querySelectorAll(
            "#billingBody .billing-row"
        );


    rows.forEach(
        function (row, index) {

            const numberCell =
                row.querySelector(
                    ".row-number"
                );


            if (numberCell) {

                numberCell.textContent =
                    index + 1;

            }

        }
    );

}


/* ============================================================
   INITIALIZE EXISTING ROWS
============================================================ */

function initializeExistingRows() {

    const rows =
        document.querySelectorAll(
            "#billingBody tr"
        );


    rows.forEach(
        function (row) {

            attachDeleteButton(
                row
            );

        }
    );


    updateRowNumbers();

}


/* ============================================================
   ATTACH DELETE BUTTON TO EXISTING ROW
============================================================ */

function attachDeleteButton(row) {

    if (!row) {
        return;
    }


    const deleteButton =
        row.querySelector(
            ".delete-row"
        );


    if (!deleteButton) {
        return;
    }


    deleteButton.addEventListener(
        "click",
        function () {

            deleteBillingRow(row);

        }
    );

}


/* ============================================================
   CLEAR BILL
============================================================ */

function clearBill() {

    const confirmed =
        window.confirm(
            "Clear all patient information, billing rows and totals?"
        );


    if (!confirmed) {
        return;
    }


    /* ========================================================
       PATIENT INFORMATION
    ======================================================== */

    const patientFields = [

        "ipdNo",

        "uhid",

        "patientName",

        "age",

        "sdwo",

        "gender",

        "maritalStatus",

        "admissionDate",

        "diagnosis",

        "address"

    ];


    patientFields.forEach(
        function (id) {

            const field =
                document.getElementById(id);


            if (field) {

                field.value =
                    "";

            }

        }
    );


    /* ========================================================
       REMARKS
    ======================================================== */

    const remarks =
        document.getElementById(
            "billRemarks"
        );


    if (remarks) {

        remarks.value =
            "";

    }


    /* ========================================================
       BILLING TOTALS
    ======================================================== */

    setFieldValue(
        "totalPackageWithoutIncentives",
        "₹0.00"
    );


    setFieldValue(
        "totalAdjustedPackageAmount",
        "₹0.00"
    );


    setFieldValue(
        "totalPayableAmount",
        "₹0.00"
    );


    setFieldValue(
        "eRupiAmount",
        "₹0.00"
    );


    setFieldValue(
        "miscellaneousAmount",
        "₹0.00"
    );


    /* ========================================================
       BILLING TABLE
    ======================================================== */

    const billingBody =
        document.getElementById(
            "billingBody"
        );


    if (billingBody) {

        billingBody.innerHTML =
            "";

    }


    billingRowNumber =
        0;


    /*
       Add a new empty row.
    */

    addBillingRow();

}


/* ============================================================
   NEW BILL
============================================================ */

function newBill() {

    const confirmed =
        window.confirm(
            "Start a new bill? All current information will be cleared."
        );


    if (!confirmed) {
        return;
    }


    clearBill();

}


/* ============================================================
   SET FIELD VALUE
============================================================ */

function setFieldValue(
    id,
    value
) {

    const field =
        document.getElementById(id);


    if (field) {

        field.value =
            value;

    }

}


/* ============================================================
   GET FIELD VALUE
============================================================ */

function getFieldValue(id) {

    const field =
        document.getElementById(id);


    if (!field) {
        return "";
    }


    return field.value;

}


/* ============================================================
   PRINT BILL
============================================================ */

function printBill() {

    /*
       Browser print dialog.

       print.css controls:
       • page size
       • header space
       • footer space
       • hidden buttons
       • hidden remarks
       • hidden action column
       • print layout
    */

    window.print();

}


/* ============================================================
   KEYBOARD SHORTCUT
============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           Ctrl + P
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "p"
        ) {

            event.preventDefault();

            printBill();

        }

    }
);


/* ============================================================
   ENTER KEY SUPPORT
============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           Do not interfere with textarea.
        */

        if (
            event.target &&
            event.target.tagName ===
            "TEXTAREA"
        ) {

            return;

        }


        /*
           Enter in billing table:
           create a new row when pressed
           from the last editable field.
        */

        if (
            event.key === "Enter" &&
            event.target &&
            event.target.closest(
                "#billingTable"
            )
        ) {

            const row =
                event.target.closest(
                    "tr"
                );


            if (!row) {
                return;
            }


            const inputs =
                Array.from(
                    row.querySelectorAll(
                        "input"
                    )
                );


            const currentIndex =
                inputs.indexOf(
                    event.target
                );


            /*
               Move to next field.
            */

            if (
                currentIndex >= 0 &&
                currentIndex <
                    inputs.length - 1
            ) {

                event.preventDefault();


                inputs[
                    currentIndex + 1
                ].focus();


                return;

            }


            /*
               Last field:
               create a new row.
            */

            if (
                currentIndex ===
                inputs.length - 1
            ) {

                event.preventDefault();

                addBillingRow();

            }

        }

    }
);


/* ============================================================
   CLICK OUTSIDE INPUT
   NO AUTOMATIC CALCULATION

   IMPORTANT:
   Billing totals remain manually editable.
============================================================ */


/* ============================================================
   OPTIONAL PACKAGE DATA LOADING
============================================================ */

async function loadPackages() {

    try {

        const response =
            await fetch(
                "/static/data/packages.json",
                {
                    method: "GET",
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load packages"
            );

        }


        const packages =
            await response.json();


        return packages;

    }
    catch (error) {

        console.error(
            "Package loading error:",
            error
        );


        return [];

    }

}


/* ============================================================
   PACKAGE SEARCH HELPER
============================================================ */

async function findPackage(
    packageCode
) {

    const packages =
        await loadPackages();


    if (
        !Array.isArray(packages)
    ) {

        return null;

    }


    const search =
        String(
            packageCode || ""
        )
        .trim()
        .toLowerCase();


    if (!search) {

        return null;

    }


    return packages.find(
        function (item) {

            const code =
                String(
                    item.code ||
                    item.packageCode ||
                    ""
                )
                .trim()
                .toLowerCase();


            return code === search;

        }
    ) || null;

}


/* ============================================================
   APPLY PACKAGE TO ROW
============================================================ */

async function applyPackageToRow(
    row,
    packageCode
) {

    if (!row) {
        return;
    }


    const packageData =
        await findPackage(
            packageCode
        );


    if (!packageData) {
        return;
    }


    const inputs =
        row.querySelectorAll(
            "input"
        );


    /*
       Table columns:

       0 = Package Code
       1 = Package Type
       2 = Procedure Cost
       3 = Stratification Cost
       4 = Qty
       5 = Package Cost
       6 = Adj Factor
       7 = Incentives
       8 = Total Amount
       9 = Remarks
    */


    if (inputs[0]) {

        inputs[0].value =
            packageData.code ||
            packageData.packageCode ||
            "";

    }


    if (inputs[1]) {

        inputs[1].value =
            packageData.type ||
            packageData.packageType ||
            "";

    }


    if (inputs[2]) {

        inputs[2].value =
            packageData.procedureCost ??
            "";

    }


    if (inputs[3]) {

        inputs[3].value =
            packageData.stratificationCost ??
            "";

    }


    if (inputs[4]) {

        inputs[4].value =
            packageData.qty ??
            "";

    }


    if (inputs[5]) {

        inputs[5].value =
            packageData.packageCost ??
            "";

    }


    if (inputs[6]) {

        inputs[6].value =
            packageData.adjustmentFactor ??
            "";

    }


    if (inputs[7]) {

        inputs[7].value =
            packageData.incentives ??
            "";

    }


    if (inputs[8]) {

        inputs[8].value =
            packageData.totalAmount ??
            "";

    }


    if (inputs[9]) {

        inputs[9].value =
            packageData.remarks ??
            "";

    }

}


/* ============================================================
   BILL DATA COLLECTION
============================================================ */

function collectBillData() {

    const data = {

        patient: {

            ipdNo:
                getFieldValue("ipdNo"),

            uhid:
                getFieldValue("uhid"),

            patientName:
                getFieldValue("patientName"),

            age:
                getFieldValue("age"),

            sdwo:
                getFieldValue("sdwo"),

            gender:
                getFieldValue("gender"),

            maritalStatus:
                getFieldValue("maritalStatus"),

            admissionDate:
                getFieldValue(
                    "admissionDate"
                ),

            diagnosis:
                getFieldValue(
                    "diagnosis"
                ),

            address:
                getFieldValue(
                    "address"
                )

        },


        billing: [],


        totals: {

            totalPackageWithoutIncentives:
                getFieldValue(
                    "totalPackageWithoutIncentives"
                ),

            totalAdjustedPackageAmount:
                getFieldValue(
                    "totalAdjustedPackageAmount"
                ),

            totalPayableAmount:
                getFieldValue(
                    "totalPayableAmount"
                ),

            eRupiAmount:
                getFieldValue(
                    "eRupiAmount"
                ),

            miscellaneousAmount:
                getFieldValue(
                    "miscellaneousAmount"
                )

        },


        remarks:
            getFieldValue(
                "billRemarks"
            )

    };


    /* ========================================================
       BILLING ROWS
    ======================================================== */

    const rows =
        document.querySelectorAll(
            "#billingBody .billing-row"
        );


    rows.forEach(
        function (row) {

            const inputs =
                row.querySelectorAll(
                    "input"
                );


            data.billing.push({

                packageCode:
                    inputs[0]?.value || "",

                packageType:
                    inputs[1]?.value || "",

                procedureCost:
                    inputs[2]?.value || "",

                stratificationCost:
                    inputs[3]?.value || "",

                qty:
                    inputs[4]?.value || "",

                packageCost:
                    inputs[5]?.value || "",

                adjustmentFactor:
                    inputs[6]?.value || "",

                incentives:
                    inputs[7]?.value || "",

                totalAmount:
                    inputs[8]?.value || "",

                remarks:
                    inputs[9]?.value || ""

            });

        }
    );


    return data;

}


/* ============================================================
   EXPORT BILL DATA TO JSON
============================================================ */

function exportBillData() {

    const data =
        collectBillData();


    const json =
        JSON.stringify(
            data,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "ayushman-bill.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* ============================================================
   IMPORT BILL DATA
============================================================ */

function importBillData(data) {

    if (!data) {
        return;
    }


    /* ========================================================
       PATIENT
    ======================================================== */

    const patient =
        data.patient || {};


    setFieldValue(
        "ipdNo",
        patient.ipdNo || ""
    );


    setFieldValue(
        "uhid",
        patient.uhid || ""
    );


    setFieldValue(
        "patientName",
        patient.patientName || ""
    );


    setFieldValue(
        "age",
        patient.age || ""
    );


    setFieldValue(
        "sdwo",
        patient.sdwo || ""
    );


    setFieldValue(
        "gender",
        patient.gender || ""
    );


    setFieldValue(
        "maritalStatus",
        patient.maritalStatus || ""
    );


    setFieldValue(
        "admissionDate",
        patient.admissionDate || ""
    );


    setFieldValue(
        "diagnosis",
        patient.diagnosis || ""
    );


    setFieldValue(
        "address",
        patient.address || ""
    );


    /* ========================================================
       TOTALS
    ======================================================== */

    const totals =
        data.totals || {};


    setFieldValue(
        "totalPackageWithoutIncentives",
        totals.totalPackageWithoutIncentives ||
            ""
    );


    setFieldValue(
        "totalAdjustedPackageAmount",
        totals.totalAdjustedPackageAmount ||
            ""
    );


    setFieldValue(
        "totalPayableAmount",
        totals.totalPayableAmount ||
            ""
    );


    setFieldValue(
        "eRupiAmount",
        totals.eRupiAmount ||
            ""
    );


    setFieldValue(
        "miscellaneousAmount",
        totals.miscellaneousAmount ||
            ""
    );


    /* ========================================================
       REMARKS
    ======================================================== */

    setFieldValue(
        "billRemarks",
        data.remarks || ""
    );


    /* ========================================================
       BILLING TABLE
    ======================================================== */

    const billingBody =
        document.getElementById(
            "billingBody"
        );


    if (!billingBody) {
        return;
    }


    billingBody.innerHTML =
        "";


    billingRowNumber =
        0;


    const billing =
        Array.isArray(
            data.billing
        )
            ? data.billing
            : [];


    if (
        billing.length === 0
    ) {

        addBillingRow();

        return;

    }


    billing.forEach(
        function (item) {

            addBillingRow(
                item
            );

        }
    );


    updateRowNumbers();

}


/* ============================================================
   EXPOSE FUNCTIONS GLOBALLY

   This allows existing HTML onclick handlers,
   if any, to continue working.
============================================================ */

window.addBillingRow =
    addBillingRow;


window.addRow =
    addBillingRow;


window.deleteBillingRow =
    deleteBillingRow;


window.clearBill =
    clearBill;


window.newBill =
    newBill;


window.printBill =
    printBill;


window.collectBillData =
    collectBillData;


window.exportBillData =
    exportBillData;


window.importBillData =
    importBillData;


window.loadPackages =
    loadPackages;


window.findPackage =
    findPackage;


window.applyPackageToRow =
    applyPackageToRow;