# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models


class PosOrder(models.Model):
    _inherit = "pos.order"

    def _payment_fields(self, cr, uid, ui_paymentline, context=None):
        res = super(PosOrder, self)._payment_fields(
            cr, uid, ui_paymentline, context=context
        )
        if 'payment_ref' in ui_paymentline:
            res.update({
                'pos_card_payment_info': ui_paymentline['payment_ref']
            })
        if 'payment_bank' in ui_paymentline:
            res.update({
                'pos_payment_bank_id': ui_paymentline['payment_bank']
            })
        return res

    def add_payment(self, cr, uid, order_id, data, context=None):
        statement_id = super(PosOrder, self).add_payment(
            cr, uid, order_id, data, context=context
        )
        obj_bank_stmt_line = self.pool.get('account.bank.statement.line')
        criteria = [
            ('statement_id', '=', statement_id),
            ('pos_statement_id', '=', order_id),
            ('journal_id', '=', data['journal']),
            ('amount', '=', data['amount'])
        ]
        statement_line_ids =\
            obj_bank_stmt_line.search(cr, uid, criteria)
        statement_line_id =\
            obj_bank_stmt_line.browse(cr, uid, statement_line_ids)
        for line in statement_line_id:
            if 'pos_card_payment_info' in data and\
                    'pos_payment_bank_id' in data:
                pos_card_payment = data['pos_card_payment_info']
                pos_payment_bank = data['pos_payment_bank_id']
                if not line.pos_card_payment_info and not\
                        line.pos_payment_bank_id:
                    check_vals = {
                        'pos_card_payment_info': pos_card_payment,
                        'pos_payment_bank_id': pos_payment_bank
                    }
                    obj_bank_stmt_line.write(
                        cr, uid, [line.id], check_vals, context=context)
                    break

        return statement_id
