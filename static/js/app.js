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
   • Browser-only package master storage
   • Keyboard-friendly operation
============================================================ */


/* ============================================================
   GLOBAL APPLICATION STATE
============================================================ */

let billingRowNumber = 0;

const STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_BILLING_DRAFT_V1";
const PACKAGE_STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_PACKAGE_MASTER_V1";
let saveTimer = null;


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

    restoreDraft();

    bindStorageListeners();

    saveDraft();

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

    const packageInput = row.querySelector("input");
    if (packageInput) packageInput.setAttribute("list", "blssnvj21-package-codes");

    scheduleSave();

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
   BROWSER-ONLY STORAGE
   ------------------------------------------------------------
   Patient/billing data is stored only in the user's browser
   using localStorage. Nothing is posted to the Flask server.
============================================================ */

function getDraftData() {
    const data = {
        patient: {},
        totals: {},
        remarks: "",
        rows: []
    };

    [
        "ipdNo", "uhid", "patientName", "age", "sdwo",
        "gender", "maritalStatus", "admissionDate",
        "diagnosis", "address"
    ].forEach(function (id) {
        data.patient[id] = getFieldValue(id);
    });

    [
        "totalPackageWithoutIncentives",
        "totalAdjustedPackageAmount",
        "totalPayableAmount",
        "eRupiAmount",
        "miscellaneousAmount"
    ].forEach(function (id) {
        data.totals[id] = getFieldValue(id);
    });

    data.remarks = getFieldValue("billRemarks");

    document.querySelectorAll("#billingBody .billing-row").forEach(function (row) {
        const inputs = row.querySelectorAll("input");
        data.rows.push({
            packageCode: inputs[0]?.value || "",
            packageType: inputs[1]?.value || "",
            procedureCost: inputs[2]?.value || "",
            stratificationCost: inputs[3]?.value || "",
            qty: inputs[4]?.value || "",
            packageCost: inputs[5]?.value || "",
            adjustmentFactor: inputs[6]?.value || "",
            incentives: inputs[7]?.value || "",
            totalAmount: inputs[8]?.value || "",
            remarks: inputs[9]?.value || ""
        });
    });

    return data;
}

function saveDraft() {
    try {
        const payload = getDraftData();
        payload.meta = {
            app: "BLSSNVJ21",
            version: APP_VERSION || "2026.10",
            schemaVersion: BILL_SCHEMA_VERSION || 2,
            savedAt: new Date().toISOString()
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        if (typeof setStorageStatus === "function") {
            setStorageStatus("Saved locally", "ready");
        }
    } catch (error) {
        console.warn("Browser storage unavailable:", error);
        if (typeof setStorageStatus === "function") {
            setStorageStatus("Local save unavailable", "error");
        }
    }
}

function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveDraft, 150);
}

function removeSavedDraft() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Unable to clear browser storage:", error);
    }
}

function restoreDraft() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);
        if (!data || typeof data !== "object") return;

        Object.entries(data.patient || {}).forEach(function ([id, value]) {
            setFieldValue(id, value);
        });

        Object.entries(data.totals || {}).forEach(function ([id, value]) {
            setFieldValue(id, value);
        });

        setFieldValue("billRemarks", data.remarks || "");

        const billingBody = document.getElementById("billingBody");
        if (!billingBody) return;

        billingBody.innerHTML = "";
        billingRowNumber = 0;

        const rows = Array.isArray(data.rows) && data.rows.length
            ? data.rows
            : [{}];

        rows.forEach(function (row) {
            addBillingRow(row);
        });

        updateRowNumbers();
    } catch (error) {
        console.warn("Unable to restore browser draft:", error);
    }
}

function bindStorageListeners() {
    document.addEventListener("input", function (event) {
        if (
            event.target.matches("input, textarea") &&
            !event.target.closest(".no-storage")
        ) {
            scheduleSave();
        }
    });

    document.addEventListener("change", function (event) {
        if (
            event.target.matches("input, textarea") &&
            !event.target.closest(".no-storage")
        ) {
            scheduleSave();
        }
    });
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

    removeSavedDraft();

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

function loadPackages() {
    try {
        const cached = window.localStorage.getItem(PACKAGE_STORAGE_KEY);

        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }

        const packages = [
            {
                code: "PKG001",
                name: "Sample Package",
                type: "Procedure",
                procedureCost: 50000,
                stratificationCost: 10000,
                adjustmentFactor: 1,
                incentive: 0
            },
            {
                code: "PKG002",
                name: "Sample Surgery Package",
                type: "Surgery",
                procedureCost: 75000,
                stratificationCost: 15000,
                adjustmentFactor: 1,
                incentive: 0
            },
            {
                code: "PKG003",
                name: "Sample Maternity Package",
                type: "Maternity",
                procedureCost: 30000,
                stratificationCost: 5000,
                adjustmentFactor: 1,
                incentive: 0
            }
        ];

        window.localStorage.setItem(
            PACKAGE_STORAGE_KEY,
            JSON.stringify(packages)
        );

        return packages;
    } catch (error) {
        console.warn("Browser package storage unavailable:", error);
        return [];
    }
}

/* ============================================================
   PACKAGE SEARCH HELPER
============================================================ */

function findPackage(
    packageCode
) {

    const packages =
        loadPackages();


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




window.loadPackages =
    loadPackages;


window.findPackage =
    findPackage;


window.applyPackageToRow =
    applyPackageToRow;


/* ============================================================
   BLSSNVJ21 APPLICATION UPGRADE
   Browser-only tools: export, import, storage status, shortcuts
============================================================ */

const APP_VERSION = "2026.10.2";
const BILL_SCHEMA_VERSION = 4;
const HISTORY_STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_BILL_HISTORY_V1";
const HISTORY_LIMIT = 20;

function getBillHistory() {
    try {
        const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
        const history = raw ? JSON.parse(raw) : [];
        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.warn("Unable to read local bill history:", error);
        return [];
    }
}

function saveBillHistory() {
    try {
        const current = getDraftData();
        const name = String(current.patient?.patientName || "").trim() || "Unnamed Patient";
        const now = new Date();

        const snapshot = {
            id: "bill-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
            patientName: name,
            ipdNo: String(current.patient?.ipdNo || "").trim(),
            savedAt: now.toISOString(),
            data: current
        };

        const history = getBillHistory().filter(item => item && item.data);
        history.unshift(snapshot);

        window.localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(history.slice(0, HISTORY_LIMIT))
        );

        renderBillHistory();
        setStorageStatus("Bill snapshot saved locally", "ready");
    } catch (error) {
        console.warn("Unable to save bill snapshot:", error);
        setStorageStatus("Unable to save snapshot", "error");
    }
}

function restoreHistoryItem(id) {
    const item = getBillHistory().find(entry => entry.id === id);
    if (!item || !item.data) return;

    const data = item.data;

    Object.entries(data.patient || {}).forEach(([field, value]) => setFieldValue(field, value));
    Object.entries(data.totals || {}).forEach(([field, value]) => setFieldValue(field, value));
    setFieldValue("billRemarks", data.remarks || "");

    const body = document.getElementById("billingBody");
    if (body) {
        body.innerHTML = "";
        billingRowNumber = 0;
        (Array.isArray(data.rows) && data.rows.length ? data.rows : [{}]).forEach(row => addBillingRow(row));
        updateRowNumbers();
    }

    saveDraft();
    setStorageStatus("Bill restored from browser history", "ready");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteHistoryItem(id) {
    const history = getBillHistory().filter(item => item.id !== id);
    try {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        renderBillHistory();
        setStorageStatus("History item deleted locally", "ready");
    } catch (error) {
        setStorageStatus("Unable to update history", "error");
    }
}

function clearBillHistory() {
    if (!window.confirm("Delete all saved bill snapshots from this browser?")) return;
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    renderBillHistory();
    updateStorageCenter();
    setStorageStatus("Bill history cleared locally", "ready");
}

function renderBillHistory() {
    const list = document.getElementById("billHistoryList");
    if (!list) return;

    const history = getBillHistory();

    if (!history.length) {
        list.innerHTML = '<div class="history-empty">No local bill snapshots yet.</div>';
        return;
    }

    list.innerHTML = "";

    history.forEach(item => {
        const row = document.createElement("div");
        row.className = "history-item";

        const details = document.createElement("div");
        details.className = "history-details";

        const patient = document.createElement("strong");
        patient.textContent = item.patientName || "Unnamed Patient";

        const meta = document.createElement("span");
        const date = new Date(item.savedAt);
        meta.textContent =
            (item.ipdNo ? "IPD " + item.ipdNo + " · " : "") +
            (Number.isNaN(date.getTime()) ? item.savedAt : date.toLocaleString());

        details.append(patient, meta);

        const actions = document.createElement("div");
        actions.className = "history-actions";

        const restore = document.createElement("button");
        restore.type = "button";
        restore.className = "btn btn-secondary";
        restore.textContent = "Restore";
        restore.addEventListener("click", () => restoreHistoryItem(item.id));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn-danger";
        remove.textContent = "Delete";
        remove.addEventListener("click", () => deleteHistoryItem(item.id));

        actions.append(restore, remove);
        row.append(details, actions);
        list.appendChild(row);
    });
}

function setStorageStatus(message, state = "ready") {
    let status = document.getElementById("storageStatus");

    if (!status) {
        status = document.createElement("div");
        status.id = "storageStatus";
        status.className = "storage-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        const actions = document.querySelector(".bottom-actions");
        if (actions) actions.prepend(status);
    }

    status.textContent = message;
    status.dataset.state = state;
}

function browserStorageAvailable() {
    try {
        const key = "__BLSSNVJ21_STORAGE_TEST__";
        localStorage.setItem(key, "1");
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}

function upgradeStorageSchema() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        if (!data.meta) {
            data.meta = {
                app: "BLSSNVJ21",
                schemaVersion: BILL_SCHEMA_VERSION,
                upgradedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    } catch (error) {
        console.warn("Storage migration skipped:", error);
    }
}

function setupPackageAutocomplete() {
    const packages = loadPackages();
    const listId = "blssnvj21-package-codes";

    let datalist = document.getElementById(listId);
    if (!datalist) {
        datalist = document.createElement("datalist");
        datalist.id = listId;
        document.body.appendChild(datalist);
    }

    datalist.innerHTML = "";

    packages.forEach(function (item) {
        const option = document.createElement("option");
        option.value = item.code || item.packageCode || "";
        option.label = item.name || item.type || option.value;
        datalist.appendChild(option);
    });

    document.querySelectorAll("#billingBody .billing-row").forEach(function (row) {
        const input = row.querySelector("input");
        if (input) input.setAttribute("list", listId);
    });

    const body = document.getElementById("billingBody");
    if (!body || body.dataset.packageBinding === "1") return;

    body.dataset.packageBinding = "1";

    body.addEventListener("change", function (event) {
        const input = event.target;
        if (!input.matches("input") || !input.closest(".billing-row")) return;

        const row = input.closest(".billing-row");
        const firstInput = row.querySelector("input");
        if (input !== firstInput) return;

        const packageData = findPackage(input.value);
        if (!packageData) return;

        applyPackageToRow(row, input.value);
        scheduleSave();
        setStorageStatus("Package applied from browser master", "ready");
    });
}



window.addEventListener("beforeunload", saveDraft);
window.addEventListener("pagehide", saveDraft);
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") saveDraft();
});

document.addEventListener("keydown", function (event) {
    const key = event.key.toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier) return;

    if (key === "enter") {
        event.preventDefault();
        printBill();
    } else if (key === "n") {
        event.preventDefault();
        newBill();
    } else if (key === "a") {
        event.preventDefault();
        addBillingRow();
    }
});


/* ============================================================
   PWA SUPPORT
============================================================ */

let deferredInstallPrompt = null;

document.addEventListener("DOMContentLoaded", function () {
    registerPWA();
    setupPWAInstall();
});

function registerPWA() {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/static/sw.js")
            .catch(function (error) {
                console.warn("PWA service worker registration failed:", error);
            });
    });
}

function setupPWAInstall() {
    const installButton = document.getElementById("installPwaBtn");

    if (!installButton) {
        return;
    }

    if (window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true) {
        installButton.hidden = true;
        return;
    }

    window.addEventListener("beforeinstallprompt", function (event) {
        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.hidden = false;
    });

    installButton.addEventListener("click", async function () {
        if (!deferredInstallPrompt) {
            return;
        }

        deferredInstallPrompt.prompt();

        try {
            await deferredInstallPrompt.userChoice;
        } catch (error) {
            console.warn("PWA install prompt failed:", error);
        }

        deferredInstallPrompt = null;
        installButton.hidden = true;
    });

    window.addEventListener("appinstalled", function () {
        deferredInstallPrompt = null;
        installButton.hidden = true;
    });
}
