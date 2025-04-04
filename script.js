// script.js

document.addEventListener("DOMContentLoaded", () => {
    const draggables = document.querySelectorAll(".draggable");
    const dropZone = document.getElementById("drop-zone");
    const form = document.getElementById("dynamic-form");
    const bgColorInput = document.getElementById("bg-color");
    const saveButton = document.getElementById("save-form");

    const labelText = document.getElementById("label-text");
    const placeholderText = document.getElementById("placeholder-text");
    const optionsText = document.getElementById("options-text");
    const deleteButton = document.getElementById("delete-field");
    const fieldSettings = document.getElementById("field-settings");

    let selectedField = null;

    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("type", e.target.getAttribute("data-type"));
        });
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "green";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "#ccc";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#ccc";

        const fieldType = e.dataTransfer.getData("type");
        const fieldElement = createFormElement(fieldType);
        if (fieldElement) {
            dropZone.appendChild(fieldElement);
            makeFieldsSortable();
        }
    });

    function createFormElement(type) {
        const field = document.createElement("div");
        field.classList.add("field");
        field.setAttribute("draggable", "true");

        switch (type) {
            case "header":
                field.innerHTML = `<h2 contenteditable="true">Header Text</h2>`;
                break;
            case "text":
                field.innerHTML = `<label>Text Input:</label> <input type="text" placeholder="Enter text">`;
                break;
            case "email":
                field.innerHTML = `<label>Email:</label> <input type="email" placeholder="Enter email">`;
                break;
            case "password":
                field.innerHTML = `<label>Password:</label> <input type="password" placeholder="Enter password">`;
                break;
            case "number":
                field.innerHTML = `<label>Number:</label> <input type="number" placeholder="Enter number">`;
                break;
            case "date":
                field.innerHTML = `<label>Date:</label> <input type="date">`;
                break;
            case "time":
                field.innerHTML = `<label>Time:</label> <input type="time">`;
                break;
            case "checkbox":
                field.innerHTML = `<label><input type="checkbox"> Checkbox</label>`;
                break;
            case "radio":
                field.innerHTML = `<label><input type="radio" name="radio-group"> Radio</label>`;
                break;
            case "select":
                field.innerHTML = `<label>Dropdown:</label> <select><option>Option 1</option><option>Option 2</option></select>`;
                break;
            case "textarea":
                field.innerHTML = `<label>Textarea:</label> <textarea placeholder="Enter text"></textarea>`;
                break;
            case "submit":
                field.innerHTML = `<button type="submit">Submit</button>`;
                break;
            default:
                return null;
        }

        field.addEventListener("click", () => {
            selectedField = field;
            showFieldSettings(field);
        });

        return field;
    }

    function showFieldSettings(field) {
        const label = field.querySelector("label");
        const input = field.querySelector("input, textarea, select");

        if (label) {
            labelText.value = label.textContent.replace(":", "").trim();
        } else {
            labelText.value = "";
        }

        if (input && input.placeholder !== undefined) {
            placeholderText.value = input.placeholder;
        } else {
            placeholderText.value = "";
        }

        if (input && input.tagName === "SELECT") {
            optionsText.style.display = "block";
            const options = Array.from(input.options).map(o => o.text).join(", ");
            optionsText.value = options;
        } else {
            optionsText.style.display = "none";
            optionsText.value = "";
        }
    }

    labelText.addEventListener("input", () => {
        if (selectedField) {
            const label = selectedField.querySelector("label");
            if (label) label.textContent = labelText.value + ":";
        }
    });

    placeholderText.addEventListener("input", () => {
        if (selectedField) {
            const input = selectedField.querySelector("input, textarea");
            if (input) input.placeholder = placeholderText.value;
        }
    });

    optionsText.addEventListener("input", () => {
        if (selectedField) {
            const select = selectedField.querySelector("select");
            if (select) {
                const options = optionsText.value.split(",").map(o => o.trim());
                select.innerHTML = options.map(o => `<option>${o}</option>`).join("");
            }
        }
    });

    deleteButton.addEventListener("click", () => {
        if (selectedField) {
            selectedField.remove();
            selectedField = null;
            labelText.value = "";
            placeholderText.value = "";
            optionsText.value = "";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Form submitted!");
    });

    bgColorInput.addEventListener("input", (e) => {
        dropZone.style.backgroundColor = e.target.value;
    });

    saveButton.addEventListener("click", () => {
        let fieldsHTML = "";
        dropZone.childNodes.forEach(child => {
            if (child.nodeType === 1) {
                fieldsHTML += child.outerHTML + "\n";
            }
        });

        let bgColor = bgColorInput.value;

        let fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: ${bgColor};
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px;
        }
        .form-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
        }
        // h1 {
        //     text-align: center;
        // }
        form {
            display: flex;
            flex-direction: column;
            text-align: center;
            
        }
        .field {
            display: flex;
            align-items: center;
            gap: 5px; 
            margin-bottom: 10px;
            white-space: nowrap; /* Prevent label from moving to the next line */
        }

        .field label {
            margin: 0; 
            padding:0;
            font-weight: bold;
        }
        .field input[type="checkbox"],
        .field input[type="radio"] {
            width: 16px;
            height: 16px;
            margin: 0;
        }
        input, select, textarea, button {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
        }
        button {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <h1>Saved Form</h1>
    <div class="form-container">
        <form>
            ${fieldsHTML}
        </form>
    </div>
</body>
</html>`;

        let blob = new Blob([fileContent], { type: "text/html" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "saved_form.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert("Your form has been saved successfully!");
    });

    function makeFieldsSortable() {
        const fields = dropZone.querySelectorAll(".field");
        fields.forEach(field => {
            field.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", null);
                field.classList.add("dragging");
            });
            field.addEventListener("dragend", () => {
                field.classList.remove("dragging");
            });
        });

        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            const dragging = document.querySelector(".dragging");
            const afterElement = getDragAfterElement(dropZone, e.clientY);
            if (afterElement == null) {
                dropZone.appendChild(dragging);
            } else {
                dropZone.insertBefore(dragging, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".field:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
