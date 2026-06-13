fetch("http://localhost:8080/listings/6a1536911c62dc336e6969e8/review", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        review: {
            comment: "",
            rating: 5
        }
    })
})
.then(res => res.json())
.then(data => {
    console.log(data);
});