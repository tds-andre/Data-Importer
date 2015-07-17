var app = app || {};
$(function () {
    'use strict';
    app.transactions = new app.TransactionCollection({elEctor:"#transaction-list-placeholder"});
    app.transactionView = new app.TransactionListView({collection:app.transactions});
    console.log("app loaded");
});