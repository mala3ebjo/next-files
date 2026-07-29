-- Repeatable seed: permission catalog, roles and the default role/permission matrix.

INSERT INTO permissions (code, permission_group, description_key) VALUES
  ('country.manage','SYSTEM','perm.country.manage'),
  ('role.manage','SYSTEM','perm.role.manage'),
  ('admin.manage','SYSTEM','perm.admin.manage'),
  ('featureflag.manage','SYSTEM','perm.featureflag.manage'),
  ('audit.view','SYSTEM','perm.audit.view'),
  ('i18n.manage','SYSTEM','perm.i18n.manage'),
  ('pricing.factor.manage','PRICING','perm.pricing.factor.manage'),
  ('corridor.manage','PRICING','perm.corridor.manage'),
  ('carrier.approve','CARRIERS','perm.carrier.approve'),
  ('carrier.suspend','CARRIERS','perm.carrier.suspend'),
  ('vehicle.verify','CARRIERS','perm.vehicle.verify'),
  ('order.view.all','ORDERS','perm.order.view.all'),
  ('order.create','ORDERS','perm.order.create'),
  ('order.assign','ORDERS','perm.order.assign'),
  ('order.cancel','ORDERS','perm.order.cancel'),
  ('order.reprice','ORDERS','perm.order.reprice'),
  ('tracking.view','ORDERS','perm.tracking.view'),
  ('chat.read','ORDERS','perm.chat.read'),
  ('payment.view','FINANCE','perm.payment.view'),
  ('payment.refund','FINANCE','perm.payment.refund'),
  ('cod.settle','FINANCE','perm.cod.settle'),
  ('payout.request','FINANCE','perm.payout.request'),
  ('payout.approve','FINANCE','perm.payout.approve'),
  ('subscription.plan.manage','COMMERCIAL','perm.subscription.plan.manage'),
  ('tier.rule.manage','COMMERCIAL','perm.tier.rule.manage'),
  ('violation.rule.manage','COMPLIANCE','perm.violation.rule.manage'),
  ('violation.action.apply','COMPLIANCE','perm.violation.action.apply'),
  ('violation.appeal.resolve','COMPLIANCE','perm.violation.appeal.resolve'),
  ('report.view','REPORTS','perm.report.view')
ON DUPLICATE KEY UPDATE permission_group=VALUES(permission_group);

INSERT INTO roles (code, name_key, is_system) VALUES
  ('SUPER_ADMIN','role.super_admin',1),
  ('ADMIN','role.admin',1),
  ('DISPATCHER','role.dispatcher',1),
  ('FINANCE','role.finance',1),
  ('SUPPORT','role.support',1),
  ('FLEET_OWNER','role.fleet_owner',1),
  ('FLEET_DISPATCHER','role.fleet_dispatcher',1),
  ('FLEET_DRIVER','role.fleet_driver',1),
  ('BROKER_OWNER','role.broker_owner',1),
  ('BROKER_DISPATCHER','role.broker_dispatcher',1),
  ('COMPANY_ADMIN','role.company_admin',1),
  ('COMPANY_REQUESTER','role.company_requester',1),
  ('CLIENT','role.client',1),
  ('DRIVER','role.driver',1)
ON DUPLICATE KEY UPDATE name_key=VALUES(name_key), is_system=VALUES(is_system);

-- SUPER_ADMIN gets everything.
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.code='SUPER_ADMIN';

-- Everyone else follows the seeded matrix from the specification, section 3.
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'pricing.factor.manage','corridor.manage','carrier.approve','carrier.suspend','vehicle.verify',
  'order.view.all','order.create','order.assign','order.cancel','order.reprice','tracking.view',
  'chat.read','payment.view','payment.refund','cod.settle','payout.approve',
  'subscription.plan.manage','tier.rule.manage','violation.rule.manage','violation.action.apply',
  'violation.appeal.resolve','i18n.manage','report.view','audit.view'
) WHERE r.code='ADMIN';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','order.create','order.assign','order.cancel','tracking.view','chat.read','report.view'
) WHERE r.code='DISPATCHER';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','payment.view','payment.refund','cod.settle','payout.approve','report.view'
) WHERE r.code='FINANCE';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','tracking.view','chat.read','payment.view','report.view'
) WHERE r.code='SUPPORT';

-- Organisation-scoped roles. The tenant filter restricts every row to the caller's organisation.
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','order.assign','order.cancel','tracking.view','chat.read',
  'payment.view','cod.settle','payout.request','vehicle.verify','report.view'
) WHERE r.code IN ('FLEET_OWNER','BROKER_OWNER');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','order.assign','order.cancel','tracking.view','chat.read'
) WHERE r.code IN ('FLEET_DISPATCHER','BROKER_DISPATCHER');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.view.all','order.create','order.cancel','tracking.view','chat.read','payment.view','report.view'
) WHERE r.code='COMPANY_ADMIN';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'order.create','tracking.view','chat.read'
) WHERE r.code IN ('COMPANY_REQUESTER','CLIENT');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
  'tracking.view','chat.read'
) WHERE r.code IN ('DRIVER','FLEET_DRIVER');
