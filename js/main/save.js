function exportSave() {
    let exp = btoa(JSON.stringify(player))

    const et = document.createElement("textarea")
    et.value = exp
    document.body.appendChild(et)
    et.select()
    et.setSelectionRange(0, 99999)
    document.execCommand("copy")
    document.body.removeChild(et);
    // Code taken from The Prestige Tree. Didn't directly copy it, though.
}

function importSave() {
    var a = prompt("Enter exported save here.")
    if (a != "") {
        player = JSON.parse(atob(a)) // I was such an idiot while doing this. Instead of "JSON.parse(atob(a))", I did "atob(JSON.parse(a))", which doesn't work at all. The error I got from this was pissing me off so much.
        console.log("Succesfully imported.")
    } else {
        alert("Please enter an exported save in the text box.")
    }
}
