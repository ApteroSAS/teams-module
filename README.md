FOR LOCAL developement copy the content of auth-start-tenant.html and auth-end-tenant.html in auth-start.html and auth-end.html


This is the axolotis-teams-modules that allows the application
to use the teams and microsoft service directly.

library contains async files and should be served in the parent project example with webpack:
```javascript
new CopyWebpackPlugin({
    patterns: [{
        from: "node_modules/@aptero/axolotis-module-teams/build/library/",
        to: "assets/js/library"
    }]
})
```

Url for debug:
https://teams.microsoft.com/_#/l/app/3501cb25-193e-48b5-baef-c0bbf37ff563?installAppPackage=true&webjoin=true&appTenantId=48caed5d-d20d-40ce-b0cd-9261fc5d8f83&login_hint=pierre.henri@aptero.co&deeplinkId=a19158ab-cd13-41c7-bb3f-26a6eb935842

