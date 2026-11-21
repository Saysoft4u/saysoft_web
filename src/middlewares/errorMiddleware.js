/**
 * وسيط معالجة الصفحات غير الموجودة (404 Not Found)
 */
function notFoundHandler(req, res, next) {
  res.status(404);

  // إذا كان الطلب بصيغة JSON أو عبر AJAX
  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({
      success: false,
      status: 404,
      message: 'الصفحة أو المورد المطلوب غير موجود'
    });
  }

  // محاولة عرض صفحة 404 المخصصة إن وجدت، أو استجابة مهيأة
  try {
    return res.render('pages/error', {
      title: 'الصفحة غير موجودة - 404',
      errorCode: 404,
      errorMessage: 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.'
    });
  } catch (err) {
    return res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; direction: rtl;">
        <h1 style="color: #e11d48;">404 - الصفحة غير موجودة</h1>
        <p>عذراً، الصفحة التي تحاول الوصول إليها غير متوفرة أو تم نقلها.</p>
        <a href="/" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0284c7; color: white; text-decoration: none; border-radius: 6px;">العودة للرئيسية</a>
      </div>
    `);
  }
}

/**
 * وسيط معالجة الأخطاء البرمجية العامة (500 Internal Server Error)
 */
function errorHandler(err, req, res, next) {
  console.error('❌ خطأ داخلي في الخادم:', err);

  const statusCode = err.status || 500;
  res.status(statusCode);

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({
      success: false,
      status: statusCode,
      message: process.env.NODE_ENV === 'production' 
        ? 'حدث خطأ داخلي في الخادم، يرجى المحاولة لاحقاً' 
        : err.message
    });
  }

  try {
    return res.render('pages/error', {
      title: 'حدث خطأ في النظام',
      errorCode: statusCode,
      errorMessage: process.env.NODE_ENV === 'production'
        ? 'حدث خطأ غير متوقع أثناء معالجة طلبك، فريق الدعم الفني يعمل على حله.'
        : err.message
    });
  } catch (renderErr) {
    return res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px; direction: rtl;">
        <h1 style="color: #dc2626;">حدث خطأ في الخادم (${statusCode})</h1>
        <p style="color: #64748b;">${process.env.NODE_ENV === 'production' ? 'يرجى المحاولة لاحقاً.' : err.message}</p>
        <a href="/" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0284c7; color: white; text-decoration: none; border-radius: 6px;">العودة للرئيسية</a>
      </div>
    `);
  }
}

module.exports = {
  notFoundHandler,
  errorHandler
};
