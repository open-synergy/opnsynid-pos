# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
# pylint: disable=locally-disabled, manifest-required-author
{
    "name": "Point Of Sale -  Restrict Price Change",
    "version": "8.0.1.0.0",
    "category": "Sale",
    "website": "https://opensynergy-indonesia.com",
    "author": "OpenSynergy Indonesia",
    "license": "AGPL-3",
    "installable": True,
    "depends": [
        "point_of_sale",
    ],
    "data": [
        'views/assets_backend.xml',
        "views/pos_config_views.xml"
    ],
}
