export enum ActionEnum {
  USER_AUTH = 'user_auth',

  USER_CARTS_SET_DISCOUNT = 'set_discount_user_cart',
  USER_CART_CREATE = 'create_user_cart',
  USER_CART_DELETE = 'delete_user_cart',
  USER_CART_DELETE_PRODUCT = 'delete_product_in_user_cart',
  USER_CART_UPDATE = 'update_user_cart',

  USER_CATEGORY_ADD_SUBCATEGORY = 'user_category_add_subcategory',
  USER_CATEGORY_CREATE = 'user_category_create',
  USER_CATEGORY_DELETE = 'user_category_delete',
  USER_CATEGORY_MOVE_SUBCATEGORY = 'user_category_move_subcategory',
  USER_CATEGORY_REMOVE_SUBCATEGORY = 'user_category_remove_subcategory',
  USER_CATEGORY_UPDATE = 'user_category_update',

  USER_CHANGE_PASSWORD = 'user_change_ password',
  USER_CHANGE_ROLE = 'user_change_ role',
  USER_CHANGE_STATUS = 'user_change_ status',
  USER_CONFIRMED = 'user_confirmed',
  USER_DELETED = 'user_deleted',
  USER_FORGOT_PASSWORD = 'user_forgot_password',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REFRESH_TOKEN = 'user_refresh_token',
  USER_REGISTER = 'user_register',
  USER_RESET_PASSWORD = 'user_reset_password',
  USER_UPDATE = 'user_update',
  USER_REGISTERED = 'user_registered',

  USER_ORDER_CONFIRMED = 'confirm_user_order',
  USER_ORDER_CREATE = 'create_user_order',
  USER_ORDER_DELETE = 'delete_user_order',
  USER_ORDER_UPDATE = 'update_user_order',

  USER_PRODUCT_CREATE = 'user_product_create',
  USER_PRODUCT_DELETE = 'user_product_delete',
  USER_PRODUCT_UPDATE = 'user_product_update',

  USER_SUB_CATEGORY_CREATE = 'user_subcategory_create',
  USER_SUB_CATEGORY_DELETE = 'user_subcategory_delete',
  USER_SUB_CATEGORY_UPDATE = 'user_subcategory_update',
}
