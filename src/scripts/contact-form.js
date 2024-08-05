function sendEmail() {
    Email.send({
        SecureToken: "C973D7AD-F097-4B95-91F4-40ABC5567812",
        To: "tobias@biblecharacters.org",
        From: document.getElementById("email").value,
        Subject: "Bible Characters Contact Form",
        Body: "Name: " + document.getElementById("name").value
            + "<br> Email: " + document.getElementById("email").value
            + "<br> Message: " + document.getElementById("message").value,
    }).then(
        (message) => alert("Message sent succesfully!")
        );
}