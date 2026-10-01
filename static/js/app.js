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

const APP_VERSION = "2026.10.2";
const BILL_SCHEMA_VERSION = 2;

let billingRowNumber = 0;
let billDirty = false;

const STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_BILLING_DRAFT_V1";
const PACKAGE_STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_PACKAGE_MASTER_V1";

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
    initializeManualSaveState();

    restoreDraft();

    markBillClean();

    /*
       Browser storage is manual only.
       Nothing is saved until the user presses Save.
    */

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

    const saveBtn =
        document.getElementById("saveBillBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            saveDraft();
        });
    }

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
    markBillDirty();

    const packageInput = row.querySelector("input");
    if (packageInput) packageInput.setAttribute("list", "blssnvj21-package-codes");

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
        if (!window.localStorage) {
            throw new Error("Browser localStorage is unavailable.");
        }

        const payload = getDraftData();
        payload.meta = {
            app: "BLSSNVJ21",
            version: APP_VERSION,
            schemaVersion: BILL_SCHEMA_VERSION,
            savedAt: new Date().toISOString()
        };

        const serialized = JSON.stringify(payload);

        // SAVE BUTTON = explicit browser-storage save.
        window.localStorage.setItem(STORAGE_KEY, serialized);

        // Verify that the browser actually stored the bill.
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored !== serialized) {
            throw new Error("Browser storage verification failed.");
        }

        markBillClean();

        const saveButton = document.getElementById("saveBillBtn");
        if (saveButton) {
            saveButton.textContent = "Saved ✓";
            saveButton.dataset.saved = "true";
        }

        setStorageStatus("Saved to browser storage", "saved");
    } catch (error) {
        console.warn("Unable to save bill to browser storage:", error);
        setStorageStatus("Save failed — browser storage unavailable", "error");
    }
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
        markBillClean();
        setStorageStatus("Saved bill restored", "saved");
    } catch (error) {
        console.warn("Unable to restore browser draft:", error);
    }
}

/* ============================================================
   MANUAL SAVE STATE
============================================================ */

function initializeManualSaveState() {
    // Delegated listeners also cover billing rows added after page load.
    document.addEventListener("input", function (event) {
        if (event.target.matches("input, textarea, select")) {
            markBillDirty();
        }
    });

    document.addEventListener("change", function (event) {
        if (event.target.matches("input, textarea, select")) {
            markBillDirty();
        }
    });

    window.addEventListener("beforeunload", function (event) {
        if (!billDirty) return;

        event.preventDefault();
        event.returnValue = "";
    });

    setStorageStatus("Ready — not saved", "ready");
}

function markBillDirty() {
    billDirty = true;
    setStorageStatus("Unsaved changes", "dirty");

    const saveButton = document.getElementById("saveBillBtn");
    if (saveButton) {
        saveButton.textContent = "Save";
        saveButton.removeAttribute("data-saved");
    }
}

function markBillClean() {
    billDirty = false;
}

function setStorageStatus(message, state = "ready") {
    const status = document.getElementById("storageStatus");
    if (!status) return;

    status.textContent = message;
    status.dataset.state = state;
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
    markBillClean();
    setStorageStatus("New bill — not saved", "ready");

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
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "s"
        ) {
            event.preventDefault();
            saveDraft();
            return;
        }

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