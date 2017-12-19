# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
{
    "name": "PoS - Card Payment Info",
    "version": "8.0.2.0.0",
    "website": "https://opensynergy-indonesia.com",
    "author": "OpenSynergy Indonesia",
    "license": "AGPL-3",
    "installable": True,
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "security/ir.model.access.csv",
        "data/pos_payment_type_data.xml",
        "views/pos_order_views.xml",
        "views/account_journal_view.xml",
        "views/pos_payment_bank_views.xml",
        "views/res_card_issuer_views.xml",
        "views/pos_payment_type_views.xml",
        "pos_card_payment_info.xml",
    ],
    "qweb": [
        "static/src/xml/pos_card_payment_info.xml",
    ],
}
