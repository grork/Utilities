﻿(function() {
    "use strict";

    var fakeClientInfo = new Codevoid.OAuth.ClientInfomation("xvz1evFS4wEEPTGEFPHBog", /* Client ID */
                                                             "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw", /* Client Secret */
                                                             "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", /* Token */
                                                             "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE"); /* Token Secret */

    alert("create real client info from the secrets that you need to test");
    var realClientInfo = new Codevoid.OAuth.ClientInfomation("", /* client id */
                                                             "", /* Client secret */
                                                             "", /* access token */
                                                             "" /* token secret */);

    function authenticationHeaderCorrectlyGenerated() {
        var url = "https://api.twitter.com/1/statuses/update.json";

        var data = [{ key: "status", value: "Hello Ladies + Gentlemen, a signed OAuth request!" },
                    { key: "include_entities", value: true }];

        var request = new Codevoid.OAuth.OAuthRequest(fakeClientInfo, url);
        request.data = data;
        request._nonce = "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg";
        request._timestamp = 1318622958;

        var result = request._generateAuthHeader();
        var expectedResult = "OAuth oauth_consumer_key=\"xvz1evFS4wEEPTGEFPHBog\", oauth_nonce=\"kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg\", oauth_signature=\"tnnArxj06cWHq44gCs1OSKk%2FjLY%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1318622958\", oauth_token=\"370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb\", oauth_version=\"1.0\"";

        strictEqual(result, expectedResult, "Encoded header strings didn't match");
    }

    function xAuthAuthenticationHeaderCorrectlyGenerated() {
        var url = "https://api.twitter.com/oauth/access_token";

        var clientInfo = new Codevoid.OAuth.ClientInfomation("JvyS7DO2qd6NNTsXJ4E7zA",
                                                             "9z6157pUbOBqtbm0A0q4r29Y2EYzIHlUwbF4Cl9c");
        var data = [{ key: "x_auth_username", value: "oauth_test_exec" },
                    { key: "x_auth_password", value: "twitter-xauth" },
                    { key: "x_auth_mode", value: "client_auth" }
        ];

        var request = new Codevoid.OAuth.OAuthRequest(clientInfo, url);
        request.data = data;
        request._nonce = "6AN2dKRzxyGhmIXUKSmp1JcB4pckM8rD3frKMTmVAo";
        request._timestamp = 1284565601;

        var result = request._generateAuthHeader();
        var expectedResult = "OAuth oauth_consumer_key=\"JvyS7DO2qd6NNTsXJ4E7zA\", oauth_nonce=\"6AN2dKRzxyGhmIXUKSmp1JcB4pckM8rD3frKMTmVAo\", oauth_signature=\"1L1oXQmawZAkQ47FHLwcOV%2Bkjwc%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1284565601\", oauth_version=\"1.0\"";

        strictEqual(result, expectedResult, "Encoded header strings didn't match");
    }

    function signatureGeneratedCorrectly() {
        var url = "https://api.twitter.com/1/statuses/update.json";
        var request = new Codevoid.OAuth.OAuthRequest(fakeClientInfo, url);
        request._nonce = "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg";
        request._timestamp = 1318622958;

        var result = request._getSignatureForString("POST&https%3A%2F%2Fapi.twitter.com%2F1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521");
        var expectedResult = "tnnArxj06cWHq44gCs1OSKk/jLY=";

        strictEqual(result, expectedResult, "Signature wasn't generated correctly");
    }

    function canVerifyTwitterCredentials() {
        var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
        var request = new Codevoid.OAuth.OAuthRequest(realClientInfo, url, "GET");
        
        stop();
        request.send().done(function (resultData) {
            var result = JSON.parse(resultData);
            strictEqual(result.screen_name, "CodevoidTest", "couldn't get screen name");
            start();
        },
        function (theXhr) {
            ok(false, "request failed");
            start();
        });
    }

    function canPostStatusToTwitter() {
        var url = "http://api.twitter.com/1.1/statuses/update.json";
        var request = new Codevoid.OAuth.OAuthRequest(realClientInfo, url);

        request.data = [{ key: "status", value: "Test@Status %78 update: " + Date.now() }];

        stop();
        request.send().done(function (resultData) {
            var result = JSON.parse(resultData);
            strictEqual(result.text, request.data[0].value);
            start();
        },
        function (theXhr) {
            ok(false, "request failed");
            start();
        });
    }

    module("OAuthRequest");
    test("authenticationHeaderCorrectlyGenerated", authenticationHeaderCorrectlyGenerated);
    test("xAuthAuthenticationHeaderCorrectlyGenerated", xAuthAuthenticationHeaderCorrectlyGenerated);
    test("signatureGeneratedCorrectly", signatureGeneratedCorrectly);
    test("canVerifyTwitterCredentials", canVerifyTwitterCredentials);
    test("canPostStatusToTwitter", canPostStatusToTwitter);
    test("canMakeGetRequestWithPayload", function canMakeGetRequestWithPayload() {
        var url = "https://api.twitter.com/1.1/statuses/home_timeline.json";
        var request = new Codevoid.OAuth.OAuthRequest(realClientInfo, url, "GET");

        request.data = [{ key: "count", value: 1 }];

        stop();
        request.send().done(function (resultData) {
            var result = JSON.parse(resultData);
            strictEqual(Array.isArray(result), true, "Result from query wasn't an array");
            strictEqual(result.length, 1, "Only expected one tweet");
            start();
        },
        function (theXhr) {
            ok(false, "request failed");
            start();
        });
    });
})();