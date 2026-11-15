/* BLSSNVJ21 Ayushman Billing — stable client runtime */
"use strict";

const APP_VERSION = "2026.11.15";
const BILL_SCHEMA_VERSION = 4;
const STORAGE_KEY = "BLSSNVJ21_AYUSHMAN_BILLING_DRAFT_V1";
const LEGACY_STORAGE_KEYS = [
    "BLSSNVJ21_AYUSHMAN_BILLING_DRAFT",
    "AYUSHMAN_BILLING_DRAFT"
];

let rowSequence = 0;
let billDirty = false;
let installPrompt = null;
let saveToggleTimer = null;
let saveResetTimer = null;

const $ = (id) => document.getElementById(id);

function storageAvailable() {
    try {
        const key = "__blssnvj21_test__";
        localStorage.setItem(key, "1");
        localStorage.removeItem(key);
        return true;
    } catch (_) {
        return false;
    }
}

function setStatus(message, state = "ready") {
    const el = $("storageStatus");
    if (!el) return;
    el.textContent = String(message).replace(/\\n|\\N|\\r|\\R/g, " ");
    el.dataset.state = state;
}

function markDirty() {
    billDirty = true;
    setStatus("Unsaved changes", "dirty");
    resetSaveToggle();
}

function markClean(message = "Saved to browser storage") {
    billDirty = false;
    setStatus(message, "saved");
}

function value(id) {
    const el = $(id);
    return el ? el.value : "";
}

function setValue(id, valueToSet) {
    const el = $(id);
    if (el) el.value = valueToSet ?? "";
}

function rowData(row) {
    const inputs = [...row.querySelectorAll("input")];
    return {
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
    };
}

function getDraft() {
    const patientIds = [
        "ipdNo","uhid","patientName","age","sdwo",
        "gender","maritalStatus","admissionDate","diagnosis","address"
    ];
    const totalIds = [
        "totalPackageWithoutIncentives",
        "totalAdjustedPackageAmount",
        "totalPayableAmount",
        "eRupiAmount",
        "miscellaneousAmount"
    ];

    const draft = { patient: {}, totals: {}, remarks: value("billRemarks"), rows: [] };

    patientIds.forEach((id) => { draft.patient[id] = value(id); });
    totalIds.forEach((id) => { draft.totals[id] = value(id); });

    document.querySelectorAll("#billingBody .billing-row").forEach((row) => {
        draft.rows.push(rowData(row));
    });

    draft.meta = {
        app: "BLSSNVJ21",
        version: APP_VERSION,
        schemaVersion: BILL_SCHEMA_VERSION,
        savedAt: new Date().toISOString()
    };
    return draft;
}

function resetSaveToggle() {
    clearTimeout(saveToggleTimer);
    clearTimeout(saveResetTimer);
    const button = $("saveBillBtn");
    if (!button) return;
    button.dataset.state = "idle";
    button.dataset.saved = "false";
    button.classList.remove("is-loading", "is-saved", "is-error");
    const label = button.querySelector(".save-toggle-label");
    if (label) label.textContent = "Save";
    button.disabled = false;
}

function saveDraft() {
    const button = $("saveBillBtn");
    if (button) {
        clearTimeout(saveToggleTimer);
        clearTimeout(saveResetTimer);
        button.disabled = true;
        button.dataset.state = "loading";
        button.classList.remove("is-saved", "is-error");
        button.classList.add("is-loading");
        const label = button.querySelector(".save-toggle-label");
        if (label) label.textContent = "Saving";
    }
    try {
        if (!storageAvailable()) throw new Error("localStorage unavailable");
        const serialized = JSON.stringify(getDraft());
        localStorage.setItem(STORAGE_KEY, serialized);
        if (localStorage.getItem(STORAGE_KEY) !== serialized) {
            throw new Error("storage verification failed");
        }
        markClean();
        if (button) {
            saveToggleTimer = setTimeout(() => {
                button.disabled = false;
                button.classList.remove("is-loading");
                button.classList.add("is-saved");
                button.dataset.state = "success";
                button.dataset.saved = "true";
                const label = button.querySelector(".save-toggle-label");
                if (label) label.textContent = "Saved";
                saveResetTimer = setTimeout(() => {
                    if (!billDirty) resetSaveToggle();
                }, 1000);
            }, 1200);
        }
    } catch (error) {
        console.error("BLSSNVJ21 save error:", error);
        if (button) {
            button.disabled = false;
            button.classList.remove("is-loading");
            button.classList.add("is-error");
            button.dataset.state = "error";
            const label = button.querySelector(".save-toggle-label");
            if (label) label.textContent = "Retry";
            saveResetTimer = setTimeout(resetSaveToggle, 1800);
        }
        setStatus("Save failed — browser storage unavailable", "error");
    }
}

function createInput(valueToSet, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = valueToSet ?? "";
    input.placeholder = placeholder;
    input.setAttribute("aria-label", placeholder);
    input.autocomplete = "off";
    input.spellcheck = false;
    return input;
}

function addRow(data = {}, focus = true) {
    const body = $("billingBody");
    if (!body) return null;

    rowSequence += 1;
    const row = document.createElement("tr");
    row.className = "billing-row";
    row.dataset.row = String(rowSequence);

    const number = document.createElement("td");
    number.className = "row-number";
    row.appendChild(number);

    const fields = [
        ["packageCode", "Package Code"],
        ["packageType", "Package Type"],
        ["procedureCost", "Procedure Cost"],
        ["stratificationCost", "Stratification Cost"],
        ["qty", "Qty"],
        ["packageCost", "Package Cost"],
        ["adjustmentFactor", "Adj. Factor"],
        ["incentives", "Incentives"],
        ["totalAmount", "Total Amount"],
        ["remarks", "Remarks"]
    ];

    fields.forEach(([key, placeholder]) => {
        const td = document.createElement("td");
        td.appendChild(createInput(data[key], placeholder));
        row.appendChild(td);
    });

    const action = document.createElement("td");
    action.className = "action-column";

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-row";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete billing row");
    del.title = "Delete billing row";
    del.addEventListener("click", () => deleteRow(row));

    action.appendChild(del);
    row.appendChild(action);
    body.appendChild(row);

    renumberRows();
    markDirty();

    if (focus) {
        const first = row.querySelector("input");
        if (first) setTimeout(() => first.focus(), 0);
    }

    return row;
}

function deleteRow(row) {
    const body = $("billingBody");
    if (!body || !row) return;

    if (body.querySelectorAll(".billing-row").length <= 1) {
        row.querySelectorAll("input").forEach((input) => { input.value = ""; });
    } else {
        row.remove();
    }

    renumberRows();
    markDirty();
}

function renumberRows() {
    document.querySelectorAll("#billingBody .billing-row").forEach((row, index) => {
        const number = row.querySelector(".row-number");
        if (number) number.textContent = String(index + 1);
    });
}

function clearBill(confirmFirst = true) {
    if (confirmFirst && !window.confirm("Clear all patient information, billing rows and totals?")) {
        return;
    }

    [
        "ipdNo","uhid","patientName","age","sdwo","gender",
        "maritalStatus","admissionDate","diagnosis","address","billRemarks"
    ].forEach((id) => setValue(id, ""));

    [
        "totalPackageWithoutIncentives",
        "totalAdjustedPackageAmount",
        "totalPayableAmount",
        "eRupiAmount",
        "miscellaneousAmount"
    ].forEach((id) => setValue(id, "₹0.00"));

    const body = $("billingBody");
    if (body) body.innerHTML = "";
    rowSequence = 0;
    addRow({}, false);

    try {
        localStorage.removeItem(STORAGE_KEY);
        LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (_) {}
    billDirty = false;
    setStatus("New bill — not saved", "ready");
    resetSaveToggle();
}

function readStoredDraft() {
    const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (raw) return { key, raw };
    }
    return null;
}

function restoreDraft() {
    if (!storageAvailable()) {
        setStatus("Browser storage unavailable", "error");
        return false;
    }

    try {
        const stored = readStoredDraft();
        if (!stored) return false;

        const draft = JSON.parse(stored.raw);
        if (!draft || typeof draft !== "object") {
            localStorage.removeItem(stored.key);
            return false;
        }

        if (draft.meta?.app && draft.meta.app !== "BLSSNVJ21") {
            localStorage.removeItem(stored.key);
            return false;
        }

        Object.entries(draft.patient || {}).forEach(([id, v]) => setValue(id, v));
        Object.entries(draft.totals || {}).forEach(([id, v]) => setValue(id, v));
        setValue("billRemarks", draft.remarks || "");

        const body = $("billingBody");
        if (!body) return false;

        body.innerHTML = "";
        rowSequence = 0;

        const rows = Array.isArray(draft.rows) && draft.rows.length ? draft.rows : [{}];
        rows.forEach((row) => addRow(row, false));

        renumberRows();

        if (stored.key !== STORAGE_KEY) {
            localStorage.setItem(STORAGE_KEY, stored.raw);
            localStorage.removeItem(stored.key);
        }

        markClean("Saved bill restored");
        return true;
    } catch (error) {
        console.error("BLSSNVJ21 restore error:", error);
        setStatus("Saved bill could not be restored", "error");
        return false;
    }
}

function applyDraft(draft) {
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
        throw new Error("Invalid bill backup format");
    }
    if (draft.meta?.app && draft.meta.app !== "BLSSNVJ21") {
        throw new Error("This JSON file belongs to a different application");
    }
    if (!draft.patient || typeof draft.patient !== "object" || Array.isArray(draft.patient) ||
        !draft.totals || typeof draft.totals !== "object" || Array.isArray(draft.totals) ||
        !Array.isArray(draft.rows) || draft.rows.length > 500 ||
        draft.rows.some((row) => !row || typeof row !== "object" || Array.isArray(row))) {
        throw new Error("Backup must contain valid patient, totals and billing rows data");
    }

    const patientIds = [
        "ipdNo","uhid","patientName","age","sdwo","gender",
        "maritalStatus","admissionDate","diagnosis","address"
    ];
    const totalIds = [
        "totalPackageWithoutIncentives","totalAdjustedPackageAmount",
        "totalPayableAmount","eRupiAmount","miscellaneousAmount"
    ];
    patientIds.forEach((id) => setValue(id, draft.patient[id] ?? ""));
    totalIds.forEach((id) => setValue(id, draft.totals[id] ?? ""));
    setValue("billRemarks", draft.remarks ?? "");

    const body = $("billingBody");
    if (!body) throw new Error("Billing table is unavailable");
    body.innerHTML = "";
    rowSequence = 0;
    (draft.rows.length ? draft.rows : [{}]).forEach((row) => addRow(row, false));
    renumberRows();
    markDirty();
    setStatus("Imported bill — review and Save", "dirty");
}

function downloadBillJson() {
    try {
        const json = JSON.stringify(getDraft(), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const patient = (value("patientName") || "bill").trim().replace(/[^a-z0-9-_]+/gi, "-");
        link.href = url;
        link.download = `BLSSNVJ21-${patient}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Bill JSON exported", "saved");
    } catch (error) {
        console.error("BLSSNVJ21 export error:", error);
        setStatus("JSON export failed", "error");
    }
}

async function copyBillJson() {
    const json = JSON.stringify(getDraft(), null, 2);
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(json);
        } else {
            const area = document.createElement("textarea");
            area.value = json;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            const copied = document.execCommand("copy");
            area.remove();
            if (!copied) throw new Error("Clipboard permission unavailable");
        }
        setStatus("Bill JSON copied", "saved");
    } catch (error) {
        console.error("BLSSNVJ21 copy error:", error);
        setStatus("Copy failed — use Export JSON instead", "error");
    }
}

function importBillFile(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        setStatus("Import rejected — JSON file exceeds 2 MB", "error");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result || ""));
            if (billDirty && !window.confirm("Replace the current unsaved bill with this imported bill?")) return;
            applyDraft(parsed);
        } catch (error) {
            console.error("BLSSNVJ21 import error:", error);
            setStatus(error.message || "Import failed — invalid JSON", "error");
        }
    };
    reader.onerror = () => setStatus("Could not read the selected JSON file", "error");
    reader.readAsText(file);
}

function clearSavedData() {
    if (!window.confirm("Clear this application's saved bill from this browser? This does not affect exported backup files.")) return;
    try {
        localStorage.removeItem(STORAGE_KEY);
        LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
        clearBill(false);
        setStatus("Saved bill cleared from this browser", "ready");
    } catch (error) {
        console.error("BLSSNVJ21 clear storage error:", error);
        setStatus("Could not clear saved bill data", "error");
    }
}

function printBill() {
    try {
        window.print();
    } catch (error) {
        console.error("BLSSNVJ21 print error:", error);
        setStatus("Print failed — please try again", "error");
    }
}

function bindUI() {
    $("addRowBtn")?.addEventListener("click", () => addRow());
    $("addBillingRowBtn")?.addEventListener("click", () => addRow());
    $("saveBillBtn")?.addEventListener("click", saveDraft);
    $("printBtn")?.addEventListener("click", printBill);
    $("exportBillBtn")?.addEventListener("click", downloadBillJson);
    $("importBillBtn")?.addEventListener("click", () => $("importBillFile")?.click());
    $("importBillFile")?.addEventListener("change", (event) => {
        importBillFile(event.target.files?.[0]);
        event.target.value = "";
    });
    $("copyJsonBtn")?.addEventListener("click", copyBillJson);
    $("clearStorageBtn")?.addEventListener("click", clearSavedData);

    $("newBillBtn")?.addEventListener("click", () => clearBill(true));

    $("installPwaBtn")?.addEventListener("click", async () => {
        const button = $("installPwaBtn");
        if (installPrompt) {
            try {
                installPrompt.prompt();
                const choice = await installPrompt.userChoice;
                if (choice?.outcome === "accepted" && button) button.hidden = true;
            } catch (error) {
                console.warn("PWA install prompt failed:", error);
            }
            installPrompt = null;
            return;
        }

        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches
            || window.navigator.standalone === true;
        if (isStandalone) {
            window.alert("This app is already installed on your device.");
        } else if (isIOS) {
            window.alert("To install: tap Share in Safari, then choose 'Add to Home Screen'.");
        } else {
            window.alert("To install this app, open your browser menu (⋮ or ⋯) and choose 'Install app' or 'Add to Home screen'. If that option is not available, check that you are using the latest Chrome or Edge and open this site over HTTPS.");
        }
    });

    document.addEventListener("input", (event) => {
        if (event.target.matches("input, textarea, select")) markDirty();
    });

    document.addEventListener("change", (event) => {
        if (event.target.matches("input, textarea, select")) markDirty();
    });

    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
            event.preventDefault();
            saveDraft();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
            event.preventDefault();
            printBill();
            return;
        }

        if (event.key !== "Enter" || !event.target.closest("#billingTable")) return;
        if (event.target.tagName === "TEXTAREA") return;

        const row = event.target.closest(".billing-row");
        if (!row) return;

        const inputs = [...row.querySelectorAll("input")];
        const index = inputs.indexOf(event.target);

        if (index >= 0 && index < inputs.length - 1) {
            event.preventDefault();
            inputs[index + 1].focus();
        } else if (index === inputs.length - 1) {
            event.preventDefault();
            addRow();
        }
    });

    window.addEventListener("beforeunload", (event) => {
        if (!billDirty) return;
        event.preventDefault();
        event.returnValue = "";
    });

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        installPrompt = event;
        const button = $("installPwaBtn");
        if (button) {
            button.hidden = false;
            button.title = "Install this app";
        }
    });

    window.addEventListener("appinstalled", () => {
        installPrompt = null;
        const button = $("installPwaBtn");
        if (button) button.hidden = true;
    });
}

async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    try {
        const registration = await navigator.serviceWorker.register("./sw.js?v=2026.11.15.1", { scope: "./" });
        await registration.update();
        if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
                if (worker.state === "installed" && navigator.serviceWorker.controller) {
                    worker.postMessage({ type: "SKIP_WAITING" });
                }
            });
        });
    } catch (error) {
        console.warn("BLSSNVJ21 service worker registration failed:", error);
    }
}

function startApp() {
    try {
        bindUI();
        const restored = restoreDraft();

        if (!restored && !$("billingBody")?.querySelector(".billing-row")) {
            addRow({}, false);
            billDirty = false;
            setStatus("Ready — not saved", "ready");
        }

        void registerServiceWorker();
    } catch (error) {
        console.error("BLSSNVJ21 startup error:", error);
        setStatus("Application startup error — check browser console", "error");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
    startApp();
}
