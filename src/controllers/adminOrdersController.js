const prisma = require('../utils/prisma');
const { verifyMasterPassword } = require('../middlewares/authMiddleware');

/**
 * عرض قائمة الطلبات
 */
async function index(req, res, next) {
  try {
    const { status, search } = req.query;

    const where = {};
    if (status) {
      where.Status = status;
    }
    if (search) {
      where.OR = [
        { OrderNumber: { contains: search } },
        { ClientName: { contains: search } },
        { WhatsappNumber: { contains: search } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { CreatedAt: 'desc' }
    });

    res.render('admin/orders/index', {
      title: 'إدارة طلبات الشراء - لوحة تحكم سايسوفت',
      orders,
      status: status || '',
      search: search || ''
    });
  } catch (error) {
    next(error);
  }
}

/**
 * عرض تفاصيل طلب معين
 */
async function view(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.order.findUnique({
      where: { IDOrder: id }
    });

    if (!order) {
      return res.status(404).send('الطلب غير موجود');
    }

    let items = [];
    try {
      items = JSON.parse(order.ItemsJson);
    } catch (e) {
      items = [];
    }

    res.render('admin/orders/view', {
      title: `تفاصيل الطلب: ${order.OrderNumber}`,
      order,
      items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * تحديث حالة الطلب
 */
async function updateStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    await prisma.order.update({
      where: { IDOrder: id },
      data: { Status: status }
    });

    res.redirect(`/admin/orders/view/${id}`);
  } catch (error) {
    next(error);
  }
}

/**
 * صفحة عرض السعر القابلة للطباعة PDF (Quotation View)
 */
async function quotation(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.order.findUnique({
      where: { IDOrder: id }
    });

    if (!order) {
      return res.status(404).send('الطلب غير موجود');
    }

    let items = [];
    try {
      items = JSON.parse(order.ItemsJson);
    } catch (e) {
      items = [];
    }

    res.render('admin/orders/quotation', {
      title: `عرض سعر - ${order.OrderNumber}`,
      order,
      items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * حذف طلب (محمي بكلمة المرور الرئيسية)
 */
async function destroy(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const masterPassword = req.body.masterPassword;

    const isValid = await verifyMasterPassword(masterPassword);
    if (!isValid) {
      return res.status(403).send('كلمة المرور الرئيسية غير صحيحة، تم رفض عملية الحذف.');
    }

    await prisma.order.delete({ where: { IDOrder: id } });
    res.redirect('/admin/orders');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  index,
  view,
  updateStatus,
  quotation,
  destroy
};
