# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
{
    "name": "PoS - Restaurant Table Management",
    "version": "8.0.2.1.0",
    "website": "https://opensynergy-indonesia.com",
    "author": "OpenSynergy Indonesia",
    "license": "AGPL-3",
    "installable": True,
    "depends": [
        "pos_restaurant",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/pos_table_views.xml",
        "views/pos_floor_views.xml",
        "views/pos_config_views.xml",
        "views/pos_order_views.xml",
        "pos_restaurant_table_management.xml",
    ],
    "qweb": [
        "static/src/xml/pos_restaurant_table_management.xml",
    ],
}
