// 获取首页轮播图和分类图
export const getFrontPageImgs = () => { return $axios('/api/profile/front_page_imgs') }
// 获取商家排序筛选信息
export const getfilterData = () => { return $axios('/api/profile/filter') }
// 获取一些商家
export const getRestaurants = (page, size, sortRule) => { return $axios.post(`/api/profile/restaurants/${page}/${size}`, sortRule) }
// 获取热门搜索词
export const getHotwords = () => { return $axios('/api/profile/hotwords') }
// 搜索带有关键词的商家
export const getDesiredRst = key_word => { return $axios(`/api/profile/typeahead/${key_word}`) }
// 获取所有城市信息
export const getCities = () => { return $axios('/api/city') }
// 获取用户基本信息
export const getUserInfo = user_id => { return $axios(`/api/user/user_info/${user_id}`) }
// 获取验证码
export const getVerificationCode = mobile => { return $axios.post('/api/login/sms_send', { mobile: mobile, SMS_ID: process.env.VUE_APP_SMS_ID, SMS_KEY: process.env.VUE_APP_SMS_KEY }) }
// 登录
export const handleLogin = (mobile, code, type) => { return $axios.post('/api/login/sms_back', { mobile: mobile, code: code, type: type }) }
// 修改密码
export const changePwd = (user_id, newPwd) => { return $axios.post(`/api/user/change_pwd/${user_id}`, { password: newPwd }) }
// 获取商家的评论信息
export const getComments = authentic_id => { return $axios(`/api/profile/comments/${authentic_id}`) }
// 获取商家的简介
export const getSellerSynopsis = () => { return $axios('/api/profile/seller') }
// 获取商家的食品列表
export const getFoodList = authentic_id => { return $axios(`/api/profile/batch_shop/${authentic_id}`) }
// 添加地址
export const addAddress = (user_id, addressInfo) => { return $axios.post(`/api/user/add_address/${user_id}`, addressInfo) }
// 编辑地址
export const handleEdieAddress = (user_id, addressId, addressInfo) => { return $axios.post(`/api/user/edit_address/${user_id}/${addressId}`, addressInfo) }
// 删除地址
export const deleteAddress = (user_id, addressId) => { return $axios.delete(`/api/user/address/${user_id}/${addressId}`) }
// 查询订单信息
export const searchOrderInfo = user_id => { return $axios( `/api/order/search_order/${user_id}`) }
// 删除订单
export const deleteOrder = (user_id, orderId) => { return $axios.delete(`/api/order/delete_order/${user_id}/${orderId}`) }
// 微信浏览器JSAPI支付
export const handlePayByJSAPI = (out_trade_no, total_fee, openid) => { return $axios.post('/api/order/wx_api_pay', { out_trade_no: out_trade_no, total_fee: total_fee, openid: openid }) }
// 微信二维码支付
export const handlePayByQRCode = (out_trade_no, total_fee) => { return $axios.post('/api/order/wx_qrcode_pay', { out_trade_no: out_trade_no, total_fee: total_fee }) }
// 取消支付
export const cancelPayment = orderId => { return $axios(`/api/order/close_order/${orderId}`) }
// 查询支付状态
export const queryPayStatus = orderId => { return $axios.post(`/api/order/pay_status/${orderId}`) }
// 添加订单
export const addOrder = (user_id, orderInfo) => { return $axios.post(`/api/order/add_order/${user_id}`, orderInfo) }
