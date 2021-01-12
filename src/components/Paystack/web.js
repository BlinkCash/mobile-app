export default `
<html>
<head>
    <meta charset="utf-8">
    <title>React Native Debugger</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
</head>
<body>
 <script src="https://js.paystack.co/v1/inline.js"></script>
<script>
    // document.addEventListener("message", function (data) {
    //     var options = JSON.parse(data.data);
    //     alert(options);
    //     payWithPaystack(options);
    // });
    
    window.onload = function() {
        var interval = setInterval(function(){
             if(window.options){
                 clearInterval(interval);
                 try{
                    payWithPaystack();
                 }catch(err){
                    alert(err);
                 }
             }
        },1000)
    }

    function payWithPaystack() {
        var handler = PaystackPop.setup({
            key: window.options.paystackKey,
            email: window.options.email,
            amount: Number(window.options.amount * 100),
            currency: "NGN",
            channels:['card'],
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
                window.ReactNativeWebView.postMessage(JSON.stringify(response));
            },
            onClose: function () {
                var closeError = {error: "Popup closed by user "};
                window.ReactNativeWebView.postMessage(JSON.stringify(closeError));
            }
        });
        handler.openIframe();
    }
</script>
</body>
</html>

`