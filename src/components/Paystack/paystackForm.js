export default `<html>
<head>
    <meta charset="utf-8">
    <title>React Native Debugger</title>
</head>
<body>
<form>
    <script src="https://js.paystack.co/v1/inline.js"></script>
</form>
<script>
    document.addEventListener("message", function (data) {
        var options = JSON.parse(data.data);
        payWithPaystack(options);
    });

    function payWithPaystack(options) {
        var handler = PaystackPop.setup({
            key: "pk_test_baf7a66e9c68ae985f751da5fec72e64a10be329",
            email: options.email,
            amount: Number(options.amount * 100),
            currency: options.currencyInitials,
            //ref: ""+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
            metadata: {
                custom_fields: [
                    {
                        display_name: "Mobile Number",
                        variable_name: "mobile_number",
                        value: "+2348012345678"
                    }
                ]
            },
            callback: function (response) {
                window.postMessage(JSON.stringify(response));
            },
            onClose: function () {
                var closeError = {error: "Popup closed by user "};
                window.postMessage(JSON.stringify(closeError));
            }
        });
        handler.openIframe();
    }
</script>
</body>
</html>`
