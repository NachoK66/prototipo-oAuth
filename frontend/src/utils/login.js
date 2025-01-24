/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
export default function oauthSignIn() {
    const nonce = Math.random().toString(36).substring(2, 15);
    
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': '182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:5173/exito',
        'response_type': 'id_token',
        'scope': 'openid profile email',
        'nonce': nonce,
        'state': 'pass-through value'
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}