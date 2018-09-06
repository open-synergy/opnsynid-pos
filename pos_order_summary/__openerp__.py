# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
{
    "name": "PoS Order Summary",
    "version": "8.0.1.3.4",
    "category": "Point of Sale",
    "website": "https://opensynergy-indonesia.com",
    "author": "OpenSynergy Indonesia",
    "license": "AGPL-3",
    "installable": True,
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/pos_order_summary_by_product.xml",
        "views/pos_order_summary_by_transaction.xml",
        "views/pos_order_summary_menu.xml"
    ],
}
