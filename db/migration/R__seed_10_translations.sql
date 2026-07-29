-- Repeatable seed: core translation keys in English and Arabic.
-- Every user-facing string in the platform is a key. This is the baseline bundle.

INSERT INTO translations (language_id, namespace, key_name, value_text)
SELECT l.id, t.ns, t.k, CASE l.code WHEN 'ar' THEN t.ar ELSE t.en END
FROM languages l
JOIN (
  -- errors
  SELECT 'error' AS ns,'error.order.weight_exceeds' AS k,'Weight exceeds the selected truck capacity' AS en,'الوزن يتجاوز حمولة الشاحنة المختارة' AS ar UNION ALL
  SELECT 'error','error.order.not_found','Order not found','الطلب غير موجود' UNION ALL
  SELECT 'error','error.quote.expired','The price quote has expired. Please try again.','انتهت صلاحية عرض السعر. يرجى المحاولة مرة أخرى.' UNION ALL
  SELECT 'error','error.payment.failed','Payment failed','فشلت عملية الدفع' UNION ALL
  SELECT 'error','error.payment.method_not_allowed','This payment method is not available in your country','طريقة الدفع هذه غير متاحة في بلدك' UNION ALL
  SELECT 'error','error.otp.invalid','The verification code is incorrect','رمز التحقق غير صحيح' UNION ALL
  SELECT 'error','error.otp.too_many','Too many attempts. Please try again later.','محاولات كثيرة. يرجى المحاولة لاحقاً.' UNION ALL
  SELECT 'error','error.driver.documents_expired','Your documents have expired','انتهت صلاحية وثائقك' UNION ALL
  SELECT 'error','error.driver.cod_limit','You are holding too much cash. Please settle first.','لديك مبلغ نقدي كبير. يرجى التسوية أولاً.' UNION ALL
  SELECT 'error','error.offer.taken','Another driver accepted this order','قبل سائق آخر هذا الطلب' UNION ALL
  SELECT 'error','error.proof.photo_required','At least one photo is required','مطلوب صورة واحدة على الأقل' UNION ALL
  SELECT 'error','error.proof.outside_geofence','You are too far from the location','أنت بعيد جداً عن الموقع' UNION ALL
  SELECT 'error','error.state.invalid_transition','This action is not allowed right now','هذا الإجراء غير مسموح الآن' UNION ALL
  SELECT 'error','error.payout.hold_active','Payouts are on hold for your account','تم تعليق التحويلات على حسابك' UNION ALL
  SELECT 'error','error.corridor.not_supported','This route is not supported yet','هذا المسار غير مدعوم حالياً' UNION ALL
  -- order statuses
  SELECT 'order','order.status.draft','Draft','مسودة' UNION ALL
  SELECT 'order','order.status.quoted','Quoted','تم التسعير' UNION ALL
  SELECT 'order','order.status.awaiting_payment','Awaiting payment','بانتظار الدفع' UNION ALL
  SELECT 'order','order.status.searching','Searching for a truck','جاري البحث عن شاحنة' UNION ALL
  SELECT 'order','order.status.unfulfilled','No truck found','لم يتم العثور على شاحنة' UNION ALL
  SELECT 'order','order.status.assigned','Driver assigned','تم تعيين السائق' UNION ALL
  SELECT 'order','order.status.driver_en_route_pickup','Driver on the way to pickup','السائق في الطريق للاستلام' UNION ALL
  SELECT 'order','order.status.at_pickup','At pickup location','في موقع الاستلام' UNION ALL
  SELECT 'order','order.status.loaded','Loaded','تم التحميل' UNION ALL
  SELECT 'order','order.status.in_transit','In transit','في الطريق' UNION ALL
  SELECT 'order','order.status.at_stop','At a stop','في نقطة توقف' UNION ALL
  SELECT 'order','order.status.at_border','At the border','عند الحدود' UNION ALL
  SELECT 'order','order.status.customs_clearance','Customs clearance','التخليص الجمركي' UNION ALL
  SELECT 'order','order.status.held_at_border','Held at the border','محتجز عند الحدود' UNION ALL
  SELECT 'order','order.status.at_dropoff','At delivery location','في موقع التسليم' UNION ALL
  SELECT 'order','order.status.delivered','Delivered','تم التسليم' UNION ALL
  SELECT 'order','order.status.cod_pending','Awaiting cash settlement','بانتظار تسوية النقد' UNION ALL
  SELECT 'order','order.status.completed','Completed','مكتمل' UNION ALL
  SELECT 'order','order.status.cancelled','Cancelled','ملغى' UNION ALL
  SELECT 'order','order.status.disputed','Under review','قيد المراجعة' UNION ALL
  -- vehicle types
  SELECT 'vehicle','vehicle.box_truck','Closed box truck','شاحنة صندوق مغلق' UNION ALL
  SELECT 'vehicle','vehicle.flatbed','Flatbed truck','شاحنة مسطحة' UNION ALL
  SELECT 'vehicle','vehicle.trailer','Trailer','شاحنة مقطورة' UNION ALL
  SELECT 'vehicle','vehicle.refrigerated','Refrigerated truck','شاحنة مبردة' UNION ALL
  SELECT 'vehicle','vehicle.tanker','Tanker','صهريج' UNION ALL
  SELECT 'vehicle','vehicle.dump_truck','Dump truck','شاحنة قلابة' UNION ALL
  SELECT 'vehicle','vehicle.container_chassis','Container chassis','شاصي حاويات' UNION ALL
  SELECT 'vehicle','vehicle.lowbed','Lowbed','شاحنة منخفضة' UNION ALL
  -- cargo types
  SELECT 'cargo','cargo.foodstuff','Foodstuff','مواد غذائية' UNION ALL
  SELECT 'cargo','cargo.furniture','Furniture','أثاث' UNION ALL
  SELECT 'cargo','cargo.construction','Construction materials','مواد بناء' UNION ALL
  SELECT 'cargo','cargo.cosmetics','Cosmetics','مستحضرات تجميل' UNION ALL
  SELECT 'cargo','cargo.machinery','Machinery','آلات' UNION ALL
  SELECT 'cargo','cargo.electronics','Electronics','إلكترونيات' UNION ALL
  SELECT 'cargo','cargo.textiles','Textiles','منسوجات' UNION ALL
  SELECT 'cargo','cargo.chilled_goods','Chilled goods','بضائع مبردة' UNION ALL
  SELECT 'cargo','cargo.livestock','Livestock','مواشي' UNION ALL
  SELECT 'cargo','cargo.chemicals','Chemicals','مواد كيميائية' UNION ALL
  SELECT 'cargo','cargo.fuel','Fuel','وقود' UNION ALL
  SELECT 'cargo','cargo.other','Other','أخرى' UNION ALL
  -- countries
  SELECT 'country','country.iq','Iraq','العراق' UNION ALL
  SELECT 'country','country.jo','Jordan','الأردن' UNION ALL
  SELECT 'country','country.sa','Saudi Arabia','السعودية' UNION ALL
  SELECT 'country','country.ae','United Arab Emirates','الإمارات' UNION ALL
  SELECT 'country','country.tr','Türkiye','تركيا' UNION ALL
  SELECT 'country','country.kw','Kuwait','الكويت' UNION ALL
  SELECT 'country','country.bh','Bahrain','البحرين' UNION ALL
  SELECT 'country','country.om','Oman','عُمان' UNION ALL
  SELECT 'country','country.sy','Syria','سوريا' UNION ALL
  SELECT 'country','country.ir','Iran','إيران' UNION ALL
  -- tiers and plans
  SELECT 'tier','tier.bronze','Bronze','برونزي' UNION ALL
  SELECT 'tier','tier.silver','Silver','فضي' UNION ALL
  SELECT 'tier','tier.gold','Gold','ذهبي' UNION ALL
  SELECT 'tier','tier.platinum','Platinum','بلاتيني' UNION ALL
  SELECT 'plan','plan.free','Free','مجاني' UNION ALL
  SELECT 'plan','plan.plus','Plus','بلس' UNION ALL
  SELECT 'plan','plan.business','Business','أعمال' UNION ALL
  -- notifications
  SELECT 'notif','notif.order_assigned.title','Driver assigned','تم تعيين السائق' UNION ALL
  SELECT 'notif','notif.order_assigned.body','{driverName} is on the way to pick up order {orderCode}','{driverName} في الطريق لاستلام الطلب {orderCode}' UNION ALL
  SELECT 'notif','notif.new_offer.title','New order nearby','طلب جديد قريب منك' UNION ALL
  SELECT 'notif','notif.new_offer.body','{distanceKm} km away for {fare}','على بعد {distanceKm} كم مقابل {fare}' UNION ALL
  SELECT 'notif','notif.order_delivered.title','Order delivered','تم تسليم الطلب' UNION ALL
  SELECT 'notif','notif.order_delivered.body','Order {orderCode} has been delivered','تم تسليم الطلب {orderCode}' UNION ALL
  SELECT 'notif','notif.application_approved.title','Your account is active','تم تفعيل حسابك' UNION ALL
  SELECT 'notif','notif.application_approved.body','You can now go online and receive orders','يمكنك الآن بدء العمل واستلام الطلبات' UNION ALL
  SELECT 'notif','notif.violation_warning.title','Warning','تنبيه' UNION ALL
  SELECT 'notif','notif.violation_warning.body','{ruleName}. Points added: {points}','{ruleName}. النقاط المضافة: {points}' UNION ALL
  -- common ui
  SELECT 'common','common.continue','Continue','متابعة' UNION ALL
  SELECT 'common','common.next','Next','التالي' UNION ALL
  SELECT 'common','common.previous','Previous','السابق' UNION ALL
  SELECT 'common','common.cancel','Cancel','إلغاء' UNION ALL
  SELECT 'common','common.confirm','Confirm','تأكيد' UNION ALL
  SELECT 'common','common.retry','Retry','إعادة المحاولة' UNION ALL
  SELECT 'common','common.go_online','Go online','بدء العمل' UNION ALL
  SELECT 'common','common.go_offline','Go offline','إيقاف العمل' UNION ALL
  SELECT 'common','common.accept','Accept','قبول' UNION ALL
  SELECT 'common','common.reject','Reject','رفض'
) t
WHERE l.code IN ('en','ar')
ON DUPLICATE KEY UPDATE value_text=VALUES(value_text);
