/**
 * @author AH.SALAH
 * @email https://github.com/AH-SALAH
 * @create date 2021-10-25 14:37:38
 * @modify date 2021-10-25 19:47:26
 * @desc mail_app js
 * @dependancy [api.js, store.js, templates.js]
 */

/* 
*      ███╗   ███╗ █████╗ ██╗██╗      █████╗ ██████╗ ██████╗ 
*     ████╗ ████║██╔══██╗██║██║     ██╔══██╗██╔══██╗██╔══██╗
*    ██╔████╔██║███████║██║██║     ███████║██████╔╝██████╔╝
*   ██║╚██╔╝██║██╔══██║██║██║     ██╔══██║██╔═══╝ ██╔═══╝ 
*  ██║ ╚═╝ ██║██║  ██║██║███████╗██║  ██║██║     ██║     
* ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝     
*/


/**
 * @description handle app store & dispatchs events after changes happen
 * @author AH.SALAH
 * @class Store
 */
class Store {

    /**
     * Creates an instance of Store.
     * @author AH.SALAH
     * @memberof Store
     */
    constructor() {
        this.target = new EventTarget();
        this.state = {};
    }

    /**
     * @description create custom event
     * @author AH.SALAH
     * @param {string} [name='']
     * @param {*} [detail={}]
     * @returns custom event
     * @memberof Store
     */
    create_store_event(name = '', detail = {}) {
        // create store custom event
        return new CustomEvent(name, {
            bubbles: true,
            detail
        });
    }

    /**
     * @description get store data
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {string} [payload='']
     * @returns *
     * @memberof Store
     */
    get(type = '', payload = '') {
        if (!type) console.warn(`type param is a must!`);
        if (!this.state[type]) return console.error(`No store type called '${type}'!`);
        if (type && !payload) return this.state[type];
        return this.state[type][payload];
    }

    /**
     * @description filter store data
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {string} [payload='']
     * @param {string} [value='']
     * @param {string} [filter_key='']
     * @returns *
     * @memberof Store
     */
    filter_data(type = '', payload = '', value = '', filter_key = '') {
        if (type && !Array.isArray(this.state[type][payload]) || !(this.state[type][payload] instanceof Object)) console.warn(`${payload} is not supported datatype yet to filter.`);
        if (type && Array.isArray(this.state[type][payload])) return this.state[type][payload].filter(v => (filter_key ? v[filter_key] : v) == value);
        if (type && this.state[type][payload] instanceof Object) return this.state[type][payload][this.state[type][payload].keys().filter(k => k == value)];
    }

    /**
     * @description remove store payload data[data specified in item] 
     * if filterkey is specified it filters by
     * then replaces new filtered data with what was exists
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {string} [payload='']
     * @param {*} [item=null]
     * @param {string} [filter_key='']
     * @returns *
     * @memberof Store
     */
    remove_payload_data(type = '', payload = '', item = null, filter_key = '') {
        if (type && !Array.isArray(this.state[type][payload]) || !(this.state[type][payload] instanceof Object)) this.state[type][payload] = item;
        if (type && Array.isArray(this.state[type][payload]) && item) {
            this.state[type][payload] = this.state[type][payload].filter(v => (filter_key ? v[filter_key] : v) != item);
            return this.state[type][payload];
        }
        if (type && this.state[type][payload] instanceof Object && item) {
            delete this.state[type][payload][item];
            return this.state[type][payload];
        }

        this.target.dispatchEvent(this.create_store_event(type, { payload: this.state[type][payload], payload_type: payload }));
    }

    /**
     * @description set store new data
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {string} [payload='']
     * @param {string} [value='']
     * @memberof Store
     */
    set(type = '', payload = '', value = '') {
        if (!type && !payload) console.warn(`Setting store data: both type and payload params must be provided to set data!`);
        this.state[type][payload] = value;
        this.target.dispatchEvent(this.create_store_event(type, { payload: this.state[type][payload], payload_type: payload }));
    }

    /**
     * @description update store
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {string} [payload='']
     * @param {string} [value='']
     * @param {string} [obj_key='']
     * @returns *
     * @memberof Store
     */
    update(type = '', payload = '', value = '', obj_key = '') {
        if (type && Array.isArray(this.state[type][payload])) {
            let with_key = v => (obj_key ? v[obj_key] : v);
            let chk = v => with_key(v) == with_key(value) ? value : v;
            this.state[type][payload] = this.state[type][payload].map(v => chk(v));
        }

        if (this.state[type][payload] instanceof Object && !Array.isArray(this.state[type][payload])) this.state[type][payload][obj_key] = value;

        this.target.dispatchEvent(this.create_store_event(type, { payload: this.state[type][payload], payload_type: payload }));
        return this.state[type][payload];
    }

    /**
     * @description assign & set store init data
     * @author AH.SALAH
     * @param {string} [type='']
     * @param {*} [datatype={}]
     * @returns * [store assigned data]
     * @memberof Store
     */
    set_store_payload(type = '', datatype = {}) {
        this.state[type] = datatype;
        return this.state[type];
    }

}

const EMAIL_APP_STORE = new Store();
// init store data props to store the info needed inside
EMAIL_APP_STORE.set_store_payload('inbox', { count: 0, data: [], current_email: {} });
EMAIL_APP_STORE.set_store_payload('sent', { count: 0, data: [], current_email: {} });
EMAIL_APP_STORE.set_store_payload('archive', { count: 0, data: [], current_email: {} });

// ========================================
/**
 * @description handle API request/response
 * @author AH.SALAH
 * @class Http
 */
class Http {

    /**
     * @description handle get request
     * @author AH.SALAH
     * @static 
     * @param {string} [url='']
     * @param {*} [params={}]
     * @returns response json
     * @memberof Http
     */
    static async get(url = '', params = {}) {
        try {
            let req = await fetch(url + new URLSearchParams(params));
            return req.json();

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description handle post request
     * @author AH.SALAH
     * @static
     * @param {string} [url='']
     * @param {*} [data={}]
     * @returns response json
     * @memberof Http
     */
    static async post(url = '', data = {}) {
        try {
            let req = await fetch(
                url,
                {
                    method: 'POST',
                    body: data instanceof FormData ? data : JSON.stringify(data)
                }
            );
            return req.json();

        } catch (error) {
            console.log(error);
        }

    }

    /**
     * @description handle put request
     * @author AH.SALAH
     * @static
     * @param {string} [url='']
     * @param {*} [data={}]
     * @returns respaonse json
     * @memberof Http
     */
    static async put(url = '', data = {}) {
        try {
            let req = await fetch(
                url,
                {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }
            );
            return req.status == 204 ? req : req.json();

        } catch (error) {
            console.log(error);
        }
    }

}


/**
 * handle api req actions by returning api url str to use
 * @author AH.SALAH
 * @class Api
 */
class Api {

    /**
     * Creates an instance of Api.
     * @author AH.SALAH
     * @param {string} [base='/emails/']
     * @memberof Api
     */
    constructor(base = '/emails/') {
        this.base = base;
        this.accounts = '/accounts/'
    }

    get_emailbox(path = '') {
        return `${this.base}${path}`;
    }

    get_email(path_id = 0) {
        return `${this.base}${path_id}`;
    }

    post_email(path = '') {
        return `${this.base}${path}`;
    }

    update_email(path_id = 0) {
        return `${this.base}${path_id}`;
    }

    get_email_counts(path = 'counts') {
        return `${this.base}${path}`;
    }

    get_user_data(path = 'user') {
        return `${this.accounts}${path}`;
    }
}

// ==========================================
/**
 * generate data templates
 * @author AH.SALAH
 * @class Templates
 */
class Templates {

    /**
     * @description handle email item template
     * @author AH.SALAH
     * @static
     * @param {*} {
     *             id = 0,
     *             sender = '',
     *             recipients = [],
     *             subject = '',
     *             body = '',
     *             timestamp = '',
     *             read = false,
     *             archived = false,
     *         }
     * @param {string} [view='']
     * @returns template string
     * @memberof Templates
     */
    static email_item_temp(
        {
            id = 0,
            sender = '',
            recipients = [],
            subject = '',
            body = '',
            timestamp = '',
            read = false,
            archived = false,
        },
        view = ''
    ) {
        let dd = `<div class="dropdown ms-3">
                    <button class="btn btn-sm dropdown-toggle" type="button" id="email-menu-${id}"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-dark py-1" aria-labelledby="email-menu-${id}">
                        <li>
                            <a href="javascript:;" data-id="${id}" class="archive-link archive-link-${id} dropdown-item btn-sm">
                                ${!archived ? '<i class="fas fa-archive"></i> Archive' : '<i class="fas fa-redo-alt"></i> Unarchive'}
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" data-id="${id}" class="msr-link msr-link-${id} dropdown-item btn-sm">
                                ${!read ? '<i class="fas fa-envelope-open-text"></i> Mark as read' : '<i class="fas fa-envelope"></i> Mark as unread'}
                            </a>
                        </li>
                    </ul>
                </div>`;

        return `
            <div class="email-item email-item-${id} list-group-item list-group-item-action border-top-0 border-end-0 ${read ? 'read' : 'unread'}">
                <div class="d-flex justify-content-start align-items-center">
                    <a href="javascript:;" title="${subject}" data-id="${id}" class="email-item-link email-item-link-${id} d-flex justify-content-start align-items-center flex-wrap w-75"
                        style="color: inherit;text-decoration:none;">
                        <div class="d-sm-flex align-items-sm-center col-md-1">
                            <img src="https://ui-avatars.com/api/?background=random&rounded=true&name=${sender}"
                                class="rounded-circle" height="33" alt="user" loading="lazy" />
                        </div>
                        <div class="sender col-md-4 px-3 text-break">
                            <h6 class="mb-0">${sender}</h6>
                        </div>
                        <div class="d-flex flex-column justify-content-between align-items-start flex-wrap mw-100 col-md-7 px-3">
                            <div
                                class="email-title d-flex justify-content-start align-items-center w-100">
                                <h6 class="mb-2 mb-md-0 text-truncate w-75 lh-base">
                                    ${subject && subject.charAt(0).toLocaleUpperCase() + subject.slice(1) || ''}
                                </h6>
                                <span class="badge bg-danger rounded-pill ms-2">${sender.split('@')[0]}</span>
                            </div>
                            <p class="mb-1 d-none">${body.split(' ').slice(0, 8).join(' ')}</p>
                        </div>
                    </a>
                    <small class="ms-auto text-muted">${timestamp}</small>
                    ${view != 'sent' ? dd : ''}
                </div>
            </div>
        `;
    }

    static email_details({
        id = 0,
        sender = '',
        recipients = [],
        subject = '',
        body = '',
        timestamp = '',
        read = false,
        archived = false,
    },
        view = '',
        ...other
    ) {
        let [util, user_data] = other;
        let handle_to = () => {
            let is_more_chk = recipients.includes(user_data.user) && recipients.length > 1 ?
                'to me & ' + `<span class="badge bg-dark rounded-pill" title="${recipients.filter(v => v != user_data.user).map(el => el + ' ')}">other</span>` :
                'to me';
            return (view != 'sent' ? is_more_chk : sender);
        };
        return `
            <div class="single-email-container single-email-container-${id} p-3" style="overflow:hidden;">
                <div class="single-email">
                    <h5>${subject}</h5>
                    <div class="email-header row">
                        <div class="sender-image col-md-1">
                            <img src="https://ui-avatars.com/api/?background=random&rounded=true&name=${sender}"
                                class="rounded-circle me-2" height="33" alt="user" loading="lazy" />
                        </div>
                        <div class="col-md-11">
                            <div class="email-head">
                                <div class="sender-email sender-email-${id} d-flex justify-content-between align-items-center">
                                    <div class="sender-info">
                                        <span class="name">${sender}</span>
                                        <span class="email">&lt;${sender}&gt;</span>
                                    </div>
                                    <div class="email-options d-flex justify-content-between align-items-center">
                                        <div class="timestamp">
                                            <small>${timestamp}</small>
                                        </div>
                                        <div class="e-options">
                                            <div class="tt" data-bs-toggle="tooltip" title="reply">
                                                <button class="reply-btn btn btn-sm btn-outline-dark ms-2 rounded-circle" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#reply-section-${id}" aria-expanded="false"
                                                    aria-controls="reply-section">
                                                    <i class="fa fa-reply" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="to">
                                    <i class="fas fa-reply fa-sm"></i> 
                                    <span title="${user_data.user}">
                                        ${handle_to()}
                                    </span>
                                </div>
                            </div>
                            <div class="email-body email-body-${id} my-3">${body}</div>
                        </div>
                    </div>
                    <div class="d-inline-block lower-reply-btn-wrapper">
                        <button class="reply-btn btn btn-sm btn-outline-dark rounded-pill" type="button" data-bs-toggle="collapse"
                            data-bs-target="#reply-section-${id}" aria-expanded="false"
                            aria-controls="reply-section">
                            <i class="fa fa-reply" aria-hidden="true"></i> Reply
                        </button>
                    </div>
                    <div class="collapse collapse-${id}" id="reply-section-${id}">
                        <div class="reply-email reply-email-${id} reply-email-header row py-3">
                            <div class="reply-sender-image col-md-1 py-3">
                                <img src="https://ui-avatars.com/api/?background=random&rounded=true&name=${sender}"
                                    class="rounded-circle me-2" height="33" alt="user" loading="lazy" />
                            </div>
                            <div class="col-md-11 shadow p-3">
                                <div class="reply-sender-email d-flex justify-content-between align-items-center">
                                    <form id="reply-form-${id}" class="w-100" name="reply-form" method="post">
                                        <div class="mb-3">
                                            <span class="input-group-text d-none" id="from-email-${id}">From</span>
                                            <input type="hidden" disabled class="form-control border-0 border-bottom rounded-pill " value="${recipients.join(',')}"
                                            placeholder="From email" aria-label="from-email" aria-describedby="from-email" readonly>
                                            <div class="mb-3 d-flex justify-content-between align-items-center">
                                                <small class="sender-text text-muted" title="from"><i class="fas fa-reply fa-sm"></i> ${sender}</small>
                                                <div class="tt" data-bs-toggle="tooltip" title="close">
                                                    <button class="reply-btn btn btn-sm btn-outline-light ms-2 text-dark rounded-circle" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#reply-section-${id}" aria-expanded="false"
                                                        aria-controls="reply-section">
                                                        <i class="fa fa-times fa-lg" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-floating mb-3" title="to">
                                            <span class="input-group-text d-none" id="reply-recipients-${id}">To</span>
                                            <input type="text" name="recipients" id="reply-recipients-${id}" value="${sender}" class="form-control border-0 border-bottom rounded-pill" placeholder="Recipients"
                                                aria-label="reply-recipients" aria-describedby="reply-recipients" required readonly>
                                                <label for="reply-recipients-${id}">Recipient</label>
                                        </div>
                                        <div class="mb-3">
                                            <span class="input-group-text d-none" id="reply-subject-${id}">Subject</span>
                                            <input type="text" name="subject" value="Re: ${subject}" class="form-control border-0 border-bottom rounded-0" placeholder="Subject"
                                                aria-label="reply-subject" aria-describedby="reply-subject" required>
                                        </div>
                                        <div class="mb-3">
                                            <span class="input-group-text d-none">Body</span>
                                            <textarea rows="7" name="body" id="body-${id}" class="form-control border-0 border-bottom rounded-0" placeholder="Write back.."
                                                aria-label="body" required autofocus="true">&#013;&#010;---------------------&#013;&#010;On ${timestamp} ${sender} wrote: &#013;&#010; ${util().encode_br(body)}
                                            </textarea>
                                        </div>
                        
                                        <button class="btn btn-primary" type="submit">
                                            <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * @description handle compose form template
     * @author AH.SALAH
     * @static
     * @param {*} { user = '' }
     * @returns
     * @memberof Templates
     */
    static compose_temp({ user = '' }) {
        return `
            <form id="compose-form" name="compose-form" method="post" class="p-3">
                <div class="mb-3">
                    <div class="mb-3 d-flex justify-content-between align-items-center">
                        <small class="sender-text text-muted"><i class="fas fa-reply fa-sm"></i> ${user}</small>
                    </div>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" name="recipients" id="compose-recipients" class="form-control border-0 border-bottom" placeholder="To"
                        aria-label="compose-recipients" aria-describedby="compose-recipients" required>
                    <label for="compose-recipients" class="text-muted">Recipients</label>
                    <small class="helper-text text-muted">e.g (you@mail.com, another@mail.com)</small>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" name="subject" id="compose-subject" class="form-control border-0 border-bottom" placeholder="Subject"
                        aria-label="compose-subject" aria-describedby="compose-subject" required>
                    <label for="compose-subject" class="text-muted">Subject</label>
                </div>
                <div class="form-floating mb-3">
                    <textarea rows="7" name="body" id="body" class="form-control border-0 border-bottom rounded-0 h-100" placeholder="..."
                        aria-label="body" required></textarea>
                    <label for="compose-subject" class="text-muted"><i class="fas fa-pencil-alt fa-sm"></i></label>
                </div>

                <button class="btn btn-primary" type="submit">
                    <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    Submit
                </button>
            </form>
        `;
    }

    // loading temp
    /**
     * @description handle loading template
     * @author AH.SALAH
     * @static
     * @returns html str
     * @memberof Templates
     */
    static loading() {

        let card = () => `
            <div class="card-body">
                <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                    <span class="placeholder col-7"></span>
                    <span class="placeholder col-4"></span>
                    <span class="placeholder col-4"></span>
                    <span class="placeholder col-6"></span>
                    <span class="placeholder col-8"></span>
                </p>
                <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
            </div>
        `;
        let l = ''
        let line = (num = 10) => { for (let i = 0; i < num; i++) { l += '<span class="placeholder col-12 mb-4 plh-' + i + '" style="height:1.4em;"></span>'; } }
        let article = (num = 10) => {
            line(num || 10);
            return `
                <p class="card-text placeholder-glow mt-2">
                    <span class="d-none placeholder col-6 mb-2"></span>
                    ${l}
                </p>
            `;
        };

        let strip = () => `
            <p class="card-text placeholder-glow">
                <span class="placeholder col-4"></span>
                <span class="placeholder col-12"></span>
            </p>
        `;

        return { card, article, strip }
    }

    /**
     * @description generate toast template
     * @author AH.SALAH
     * @static
     * @param {*} {type = 'success', toast_classes=['text-white'], data=''}
     * @returns html str
     * @memberof Templates
     */
    static toast({ type = 'success', toast_classes = ['text-white'], data = '', toast_element = false }) {
        let element = () => (`
            <div class="toast align-items-center bg-${type || 'success'} ${toast_classes.join(' ')} border-0" role="alert" aria-live="assertive"
            aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${data}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                        aria-label="Close"></button>
                </div>
            </div>
        `);

        if (toast_element) return element();

        return `<div class="toast-container position-fixed bottom-0 start-50 translate-middle-x mb-4">
                    ${element()}
                </div>`;
    }

}

// ======================================

/**
 * main mail app class
 * @author AH.SALAH
 * @class MailApp
 */
class MailApp {

    /**
     * Creates an instance of MailApp.
     * @author AH.SALAH
     * @memberof MailApp
     */
    constructor() {
        this.api = new Api();
        this.bs_tab_links = [];
        this.page_header = '';
        this.emailbox = '';
        this.event = new Event('started');
        this.curr_email = {};
        this.curr_emailbox_data = [];
        this.curr_emailbox_tab = {};
        this.curr_email_data = {}; // for details view data
        this.compose_form = null;
        this.toast_container = null;
        this.curr_user_data = {};
        this.reply_form_el = null;
        this.bs_evt_flag = null;
    }

    /**
     * @description create custom event
     * @author AH.SALAH
     * @param {string} [name='']
     * @param {*} [detail={}]
     * @returns custom event
     * @memberof MailApp
     */
    create_app_event(name = '', detail = {}, options = {}) {
        return new CustomEvent(name, {
            bubbles: true,
            detail,
            ...options
        });
    }

    /**
     * @description dispatch event on history pushstate
     * @author AH.SALAH
     * @param {*} ev
     * @param {*} data
     * @param {*} ele
     * @param {*} { ...other }
     * @memberof MailApp
     */
    emit_pushstate_ev(ev, data, ele, { ...other }) {
        history.pushState(data, other.title + ' ' + other?.id, other?.url);
        this.event = this.create_app_event(ev, data);
        ele.dispatchEvent(this.event);
    }

    /**
     * @description promise when dom loaded
     * @author AH.SALAH
     * @returns promise resolve
     * @memberof MailApp
     */
    get_elements() {
        return new Promise((resolve, reject) => {
            document.addEventListener('DOMContentLoaded', () => {
                // get init vars
                this.curr_emailbox_tab = document.querySelector('div[id^="v-pills"].tab-pane.active .list-group');
                this.bs_tab_links = document.querySelectorAll('a[data-bs-toggle="pill"]');
                this.page_header = document.querySelector('.page-header');
                this.toast_container = document.querySelector('.toast-container');
                resolve(this.curr_emailbox_tab);
            });
        });
    }

    /**
     * @description handle page title
     * @author AH.SALAH
     * @param {*} [title=this.emailbox]
     * @memberof MailApp
     */
    handle_page_title(title = this.emailbox) {
        document.title = 'Mail | ' + title;
        this.page_header.innerHTML = title;
    }

    /**
     * @description handle toast messages
     * @author AH.SALAH
     * @param {*} { type = '', classes = [], data = '' }
     * @returns *
     * @memberof MailApp
     */
    handle_messages({ type = '', classes = [], data = '' }) {
        if (!this.toast_container && !this.toast_container?.classList.contains('bs-toast')) {
            this.toast_container = document.createElement('div');
            this.toast_container.setAttribute('class', 'bs-toast');
            this.toast_container.innerHTML = Templates.toast({ type, classes, data }).trim();
            document.body.appendChild(this.toast_container);
        }
        else {
            let element = document.createElement('div');
            element.innerHTML = Templates.toast({ type, classes, data, toast_element: true }).trim();
            this.toast_container.firstElementChild.append(element.firstElementChild);
        }
        // use bs toast
        let lec = this.toast_container.firstElementChild.lastElementChild;
        if (lec) {
            let ele = new bootstrap.Toast(lec);
            ele.show();
            lec.addEventListener('hidden.bs.toast', e => e.target.remove());
        }
    }

    /**
     * @description handle submit btns loading
     * @author AH.SALAH
     * @param {string} [btn_selector='']
     * @param {boolean} [state=true]
     * @returns bool
     * @memberof MailApp
     */
    loading_btn(btn_selector = '', state = true) {
        if (!btn_selector) return false;
        let btn = document.querySelector(btn_selector);
        let spinner_border = btn.querySelector('.spinner-border');
        let spinner_grow = btn.querySelector('.spinner-grow');
        if (!btn && !(spinner_border || spinner_grow)) return false;
        [spinner_border, spinner_grow].forEach(spin => {
            if (!spin) return false;
            if (state) {
                btn.setAttribute('disabled', true);
                spin.classList.remove('d-none');
            }
            else {
                btn.removeAttribute('disabled');
                spin.classList.add('d-none');
            }
        });
    }

    /**
     * @description handle archive link actions
     * @author AH.SALAH
     * @returns *
     * @memberof MailApp
     */
    handle_archive() {
        let els = document.querySelectorAll('.archive-link');
        if (!els) return console.error(`dom element doesn't exist: ${els}`);

        let handler = async (e, id) => {
            try {
                // update store
                this.curr_emailbox_data = EMAIL_APP_STORE.remove_payload_data(this.emailbox, 'data', +id, 'id');

                let count = +EMAIL_APP_STORE.get(this.emailbox, 'count') > 0 ?
                    +EMAIL_APP_STORE.get(this.emailbox, 'count') - 1 :
                    +EMAIL_APP_STORE.get(this.emailbox, 'count');

                EMAIL_APP_STORE.set(this.emailbox, 'count', count);
                // update email req
                let resp = await Http.put(this.api.update_email(id), { archived: this.emailbox != "archive" });
                // handle status msg
                let msg = this.emailbox != "archive" ? "Archived successfully" : "Unarchived successfully";
                this.handle_messages({ data: !resp.error ? msg : resp.error, type: resp.error ? 'danger' : 'success' });
                // load the new data
                this.load_data();
                // load the new tab counts
                this.set_tabs_count();
                // return to inbox as per requirements
                if (this.emailbox != "inbox") new bootstrap.Tab(document.querySelector('#' + history.state?.email_tab.replace(this.emailbox, 'inbox')))?.show();
            } catch (error) {
                console.log(error);
                this.handle_messages({ type: 'danger', data: error });
            }
        };

        els.forEach(ele => {
            let id = ele.dataset['id'];
            ele.addEventListener('click', e => handler(e, id));
        });
    }

    /**
     * @description handke read link actions
     * @author AH.SALAH
     * @returns *
     * @memberof MailApp
     */
    handle_mark_as_read() {
        let els = document.querySelectorAll('.msr-link');
        if (!els) return console.error(`dom element doesn't exist: ${els}`);

        let handler = async (e, id) => {
            try {
                // update email req
                let mail = EMAIL_APP_STORE.filter_data(this.emailbox, 'data', id, 'id')[0];
                if (mail) mail.read = !mail.read;
                let resp = await Http.put(this.api.update_email(id), { read: mail?.read });
                // handle status msg
                let msg = mail?.read ? "Marked as read" : "Marked as unread";
                this.handle_messages({ data: !resp.error ? msg : resp.error, type: resp.error ? 'danger' : 'success' });
                // update store
                this.curr_emailbox_data = EMAIL_APP_STORE.update(this.emailbox, 'data', mail, 'id');
                // load the new data
                this.load_data();
            } catch (error) {
                console.log(error);
                this.handle_messages({ type: 'danger', data: error });
            }
        };

        els.forEach(ele => {
            let id = ele.dataset['id'];
            ele.addEventListener('click', e => handler(e, id));
        });
    }

    /**
     * @description handle email item[single email] route
     * @author AH.SALAH
     * @param {string} [dom_el='']
     * @param {string} [url='']
     * @param {string} [route='']
     * @returns *
     * @memberof MailApp
     */
    handle_emailitem_route(dom_el = '', url = '', route = '') {
        let el = document.querySelectorAll(dom_el);
        if (!el) return console.error(`dom element doesn't exist: ${el}`);

        el.forEach(ele => {
            let id = ele.dataset['id'];
            ele.addEventListener('click', e => {
                // if its different than previous item, change history state
                if (history.state?.email_id != id) {
                    e.preventDefault();
                    this.emit_pushstate_ev(
                        'pushstate',
                        {
                            email_id: id,
                            email_type: route,
                            url
                        },
                        ele,
                        {
                            title: 'email',
                            url: url + id,
                        }
                    );
                }
                e.stopPropagation();
            }, false);
        });
    }

    /**
     * @description handle simple view animation
     * @author AH.SALAH
     * @param {*} type
     * @param {*} [element=null]
     * @param {*} [cb=null]
     * @returns * || promise
     * @memberof MailApp
     */
    handle_anime(type, element = null, cb = null) {
        if (!type && !element) return console.error("type & element args are needed!");
        return new Promise(resolve => {
            let el = element;
            let flg = false;

            let handler = eve => {
                eve.target?.classList?.remove(type);
                if (cb && cb instanceof Function && !flg) cb(eve.target);
                resolve(eve.target);
                flg = true;
            };

            ['animationend', 'webkitAnimationEnd'].forEach(event => {
                el?.removeEventListener(event, handler);
                el?.addEventListener(event, handler);
            });

            el?.classList?.add(type);
        });
    }

    /**
     * @description handle bs tab click and shown events
     * @author AH.SALAH
     * @param {*} e
     * @param {*} ele
     * @param {*} prev_tab
     * @returns bool
     * @memberof MailApp
     */
    klk_shwn_handler(e, ele, prev_tab) {
        let trgt_id = e.target?.id || e.currentTarget?.id;
        if (!trgt_id) return false;

        if (prev_tab) prev_tab?.remove();
        // assign vars conditionaly on tab change
        this.curr_emailbox_tab = document.querySelector('#' + trgt_id.split('-').slice(0, -1).join('-') + ' .list-group');
        this.emailbox = trgt_id.split('-')[2];
        // handle page title
        this.handle_page_title();

        // if its not different than previous tab, return
        if (history.state?.email_tab == trgt_id) {
            e.stopPropagation();
            return false;
        }

        e.preventDefault();
        let url = '/emails/' + trgt_id.split('-')[2] + '/';
        this.emit_pushstate_ev(
            'pushstate',
            {
                email_tab: trgt_id,
                email_type: trgt_id.split('-')[2],
                url
            },
            ele,
            {
                title: 'emails',
                url,
            }
        );

    }

    /**
     * @description handle checking cases for tabs
     * @author AH.SALAH
     * @param {*} params
     * @returns bool
     * @memberof MailApp
     */
    chk_handler(...params) {
        let [e, klk_ev, shown_ev, h_e_tab, h_e_id, cb] = params;

        // prevent two events[click, shown.bs.tab] from exec twice on tab change, use evt flag
        if (h_e_id && e.type == shown_ev && this.bs_evt_flag) this.bs_evt_flag = null;
        // chk cases
        // - event click & came from single email view
        // - event shown.bs & came from another tab
        // - event shown.bs & came from single email view & flag not set yet
        let cases = (h_e_id && e.type == klk_ev) ||
            (h_e_tab && e.type == shown_ev) ||
            (h_e_id && e.type == shown_ev && !this.bs_evt_flag);
        if (!cases) return false;
        // set flag fn
        let set_flag = () => this.bs_evt_flag = e.type;
        // if event type click and flag not set, set the flag & return
        if (h_e_id && e.type == klk_ev && !this.bs_evt_flag && this.emailbox == history.state.email_type) { set_flag(); return false; }
        if (cb && cb instanceof Function) cb();
    }

    /**
     * @description listen & handle to bs tab change
     * @author AH.SALAH
     * @returns *
     * @memberof MailApp
     */
    handle_bs_listeners() {
        let tabEls = this.bs_tab_links;
        if (!tabEls) return console.error(`dom elements doesn't exist: ${tabEls}`);

        let prev_tab = null;
        let klk_ev = 'click';
        let show_ev = 'show.bs.tab';
        let shown_ev = 'shown.bs.tab';

        let apply_bs_tab_ev_handler = async (e, ele) => {
            let h_e_tab = history.state?.email_tab;
            let h_e_id = history.state?.email_id;
            // empty previous tab html for dynamic email details view which uses the same current view
            // to prevent multpile email-details-view content in the page 
            // [e.g case user send email to himself, same email-id will be in inbox & sent views for ex]
            if (h_e_id && e.type == show_ev) {
                prev_tab = this.curr_emailbox_tab?.firstElementChild;
                await this.handle_anime('slide-out', prev_tab, evv => evv?.remove());
                return false;
            }
            this.chk_handler(e, klk_ev, shown_ev, h_e_tab, h_e_id, () => this.klk_shwn_handler(e, ele, prev_tab));
        };

        let events_handler = ele => [klk_ev, shown_ev, show_ev].forEach(ev => ele.addEventListener(ev, e => apply_bs_tab_ev_handler(e, ele), false));

        tabEls.forEach(ele => events_handler(ele));
    }

    /**
     * @description handle dom listeners
     * @author AH.SALAH
     * @memberof MailApp
     */
    handle_listeners() {
        if (this.emailbox != 'compose') {
            this.handle_archive();
            this.handle_mark_as_read();
        }
        if (history.state?.email_id) this.handle_reply_form_submit();
        if (this.emailbox == 'compose') this.handle_compose_form_submit();
    }

    /**
     * @description handle dynamic style for views
     * @author AH.SALAH
     * @param {*} data_type
     * @returns *
     * @memberof MailApp
     */
    handle_dynamic_style(data_type) {
        let tab_cntnt = document.querySelector('.tab-content');
        if (!tab_cntnt) return false;
        if (data_type == 'email_details' || data_type == 'compose') {
            tab_cntnt.style.overflowY = 'visible';
            tab_cntnt.style.maxHeight = '';
        }
        else {
            tab_cntnt.style.overflowY = 'auto';
            tab_cntnt.style.maxHeight = '100vh';
        }
    }

    /**
     * @description chk & load proper view template
     * @author AH.SALAH
     * @param {*} data_type
     * @param {*} items
     * @memberof MailApp
     */
    load_data_template(data_type, items) {
        if (data_type == 'compose') {
            items.innerHTML = Templates.compose_temp(this.curr_user_data, this.emailbox).trim();
        }
        else if (data_type == 'email_details') {
            // load details temp
            items.innerHTML = Templates.email_details(EMAIL_APP_STORE.get(this.emailbox, 'current_email'), this.emailbox, this.form_util, this.curr_user_data).trim();
        }
        else {
            for (let data of this.curr_emailbox_data) {
                items.innerHTML += Templates.email_item_temp(data, this.emailbox).trim();
            }
        }
    }

    /**
     * @description load data to the dom
     * @author AH.SALAH
     * @memberof MailApp
     */
    async load_data(data_type = '') {
        let f = document.createDocumentFragment();
        let items = document.createElement('div');

        this.load_data_template(data_type, items);

        // add dom strs to the fragment
        f.appendChild(items);

        if (this.curr_emailbox_tab) {
            // if no emailbox data and the tab is not compose
            if (!this.curr_emailbox_data.length && data_type != 'compose') {
                this.curr_emailbox_tab.innerHTML = '<div class="text-center text-muted"><h5>No Data</h5><i class="fas fa-box-open fa-3x"></i></div>';
            }
            else {
                let slidein_handler = () => {
                    // add listeners to dom elements
                    this.handle_listeners();
                    // enable bs plugins after data load
                    this.enable_bs_plugins();
                    // cancel overflow on tab-content
                    this.handle_dynamic_style(data_type);

                    // init route
                    if (history.state) {
                        this.handle_emailitem_route('.email-item-link', history.state.url, history.state.email_type);
                    }
                    else {
                        this.handle_emailitem_route('.email-item-link', '/emails/inbox/', 'inbox');
                    }
                };
                let slideout_handler = () => {
                    // empty placeholders
                    this.curr_emailbox_tab.innerHTML = '';
                    // add fragment to the element
                    this.curr_emailbox_tab.appendChild(f);
                };

                await this.handle_anime('slide-out', this.curr_emailbox_tab.firstElementChild, slideout_handler);
                await this.handle_anime('slide-in', this.curr_emailbox_tab, slidein_handler);
            }
        }
    }

    // on_store_change() {
    //     Object.keys(EMAIL_APP_STORE.state).forEach(ev => {
    //         EMAIL_APP_STORE.target.addEventListener(ev, e => {
    //             if (e.detail?.payload_type == 'data') {
    //                 this.curr_emailbox_data = EMAIL_APP_STORE.get(ev, 'data');
    //                 console.log("load_data: ", ev, e, this.curr_emailbox_data);
    //                 this.load_data();
    //             }
    //         });
    //     });
    // }

    /**
     * @description form utilities fns
     * @author AH.SALAH
     * @returns {}
     * @memberof MailApp
     */
    form_util() {
        return {
            "handle_Re_change": () => {
                let el = this.reply_form_el.querySelector('[name="subject"]');
                if (!el) return false;

                let rep = 'Re: ';
                // if Re: already found , no need to add it again
                if (el.value.match(/^((Re:)(\s)?)+/g).length) el.value = el.value.replace(/^((Re:)(\s)?)+/g, rep);

                el.addEventListener('keyup', e => {
                    e.target.value = e.target.value.replace(/^(R)?(e)?(\:)?(\s)?/, rep);
                });
            },
            "reply_auto_focus": id => {
                let reply_section = document.querySelector('#reply-section-' + id);
                if (!reply_section) return false;
                reply_section.addEventListener('shown.bs.collapse', e => {
                    let body_el = this.reply_form_el.querySelector('[name="body"]');
                    if (!body_el) return false;
                    window.scrollTo(0, body_el.getBoundingClientRect().bottom, { behavior: 'smooth' });
                    body_el.focus();
                }, false);
            },
            "decode_br": str => str.replace(/(\r\n|\n|\r)/gm, "<br>"),
            "encode_br": str => str.replace(/(<br>|<\/br>)/gm, "&#013;&#010;"),
            "lower_reply_btn": () => {
                let btn = document.querySelector('.lower-reply-btn-wrapper > button');
                let collapse = document.querySelector('.collapse');
                if (!btn && collapse) return false;

                collapse.addEventListener('shown.bs.collapse', () => {
                    btn.classList.add('d-none');
                });
                collapse.addEventListener('hidden.bs.collapse', () => {
                    btn.classList.remove('d-none');
                });

            }
        }
    }

    /**
     * @description handle reply form action
     * @author AH.SALAH
     * @param {*} e
     * @returns bool || promise
     * @memberof MailApp
     */
    async handle_reply_form(e) {
        e.preventDefault();
        // get named elements
        let fd = new FormData(e.target);
        // create json object to send
        let data = {};
        for (let el of fd.entries()) data[el[0]] = typeof (el[1]) == 'string' ? el[1].trim() : el[1];
        if (data.body) data.body = this.form_util().decode_br(data.body);

        try {
            this.loading_btn('[name="reply-form"] [type="submit"]');
            // send req
            let resp = await Http.post(this.api.post_email().slice(0, -1), data);
            this.loading_btn('[name="reply-form"] [type="submit"]', false);
            // show status msg
            this.handle_messages({ data: !resp.error ? resp.message : resp.error, type: resp.error ? 'danger' : 'success' });

            if (resp.error) return false;

            // reload tabs counts
            this.set_tabs_count();
            e.target.reset();
        } catch (error) {
            console.log(error);
            this.handle_messages({ type: 'danger', data: error });
        }
    }

    /**
     * @description handle reply submit
     * @author AH.SALAH
     * @returns *
     * @memberof MailApp
     */
    handle_reply_form_submit() {
        let id = EMAIL_APP_STORE.get(this.emailbox, 'current_email').id;
        this.reply_form_el = document.querySelector('#reply-form-' + id);

        if (!this.reply_form_el) return false;

        // on submit
        this.reply_form_el.removeEventListener('submit', (e) => this.handle_reply_form(e), false);
        this.reply_form_el.addEventListener('submit', (e) => this.handle_reply_form(e), false);

        // auto focus the body
        this.form_util().reply_auto_focus(id);
        this.form_util().handle_Re_change();
        this.form_util().lower_reply_btn();
    }

    /**
     * @description getting current user data
     * @author AH.SALAH
     * @returns promise
     * @memberof MailApp
     */
    async get_user_data() {
        try {
            // get user needed data
            let resp = await Http.get(this.api.get_user_data());
            if (!resp.error) this.curr_user_data = resp;
            else this.handle_messages({ data: resp.error, type: 'danger' });
        } catch (error) {
            console.error(error);
            this.handle_messages({ type: 'danger', data: error });
        }

        return this.curr_user_data;
    }

    /**
     * @description handle getting current tab data
     * @author AH.SALAH
     * @param {*} detail
     * @memberof MailApp
     */
    async handle_current_tab_data(detail) {
        let store_count = detail?.email_tab.search(/compose/i) > -1 ? 0 : EMAIL_APP_STORE.get(detail?.email_type, 'count');
        // loading
        this.curr_emailbox_tab.innerHTML = Templates.loading().article(store_count);
        // if compose tab
        if (detail?.email_tab.search(/compose/i) > -1) {
            // load data
            this.load_data('compose');
        }
        else {
            try {
                // get current tab data
                let resp = await Http.get(this.api.get_emailbox(detail?.email_type));
                if (!resp.error) this.curr_emailbox_data = resp;
                else this.handle_messages({ type: 'danger', data: resp.error });
                // set store data
                EMAIL_APP_STORE.set(detail?.email_type, 'data', this.curr_emailbox_data);
            } catch (error) {
                console.error(error);
                this.handle_messages({ type: 'danger', data: error });
            }
            // load data to dom
            this.load_data();
            // update tabs count on tabs change
            this.set_tabs_count();
        }
    }

    /**
     * @description handle getting current single email
     * @author AH.SALAH
     * @param {*} detail
     * @memberof MailApp
     */
    async handle_email_details_data(detail) {
        try {
            // update email as read if it's not
            if (this.curr_email_data && !this.curr_email_data?.read) await Http.put(this.api.update_email(detail?.email_id), { read: true });
            // get the single email
            let resp = await Http.get(this.api.get_email(detail?.email_id));
            if (!resp.error) this.curr_email_data = resp;
            else this.handle_messages({ type: 'danger', data: resp.error });

            EMAIL_APP_STORE.set(detail?.email_type, 'current_email', this.curr_email_data);
        } catch (error) {
            console.error(error);
            this.handle_messages({ type: 'danger', data: error });
        }
        // load email details view
        this.load_data('email_details');
    }

    /**
     * @description fetch data upon tab change or single email
     * @author AH.SALAH
     * @param {*} { detail }
     * @memberof MailApp
     */
    async fetch_route_data({ detail }) {

        this.emailbox = detail?.email_type;

        //  fetch data upon tabs, but not compose tab is different handling
        if (detail?.email_tab) {
            this.handle_current_tab_data(detail);
        }
        // fetch single email data
        if (detail?.email_id) {
            this.handle_email_details_data(detail);
        }
    }

    /**
     * @description listen to state change
     * @author AH.SALAH
     * @memberof MailApp
     */
    handle_state_listener() {
        ['popstate', 'pushstate'].forEach(ev =>
            window.addEventListener(ev, e => {
                /*e=state*/
                if (e) this.fetch_route_data(e);
            })
        );
    }

    /**
     * @description request the mailbox counts
     * @author AH.SALAH
     * @memberof MailApp
     */
    async set_tabs_count() {
        try {
            let resp = await Http.get(this.api.get_email_counts());
            if (resp.error) return this.handle_messages({ type: 'danger', data: resp.error });

            if (resp) {
                for (let k in resp) {
                    if (Object.hasOwnProperty.call(resp, k)) {
                        let mbx = resp[k];
                        if (k != 'errors' && mbx) EMAIL_APP_STORE.set(k, 'count', mbx);
                    }
                }
                this.handle_tabs_count();
            }
        } catch (error) {
            console.log(error);
            this.handle_messages({ type: 'danger', data: error });
        }
    }

    /**
     * @description get & assign the counts dom elements from the store
     * @author AH.SALAH
     * @memberof MailApp
     */
    handle_tabs_count() {
        this.bs_tab_links.forEach(el => {
            if (el) {
                let badge = el.querySelector('.badge');
                if (badge) badge.innerHTML = EMAIL_APP_STORE.get(el.id.split('-')[2], 'count');
            }
        });
    }

    /**
     * @description handle compose form
     * @author AH.SALAH
     * @param {*} e
     * @returns bool || promise
     * @memberof MailApp
     */
    async handle_compose_form(e) {
        e.preventDefault();
        // get named elements
        let fd = new FormData(e.target);
        // create json object to send
        let data = {};
        for (let el of fd.entries()) data[el[0]] = typeof (el[1]) == 'string' ? el[1].trim() : el[1];
        if (data.body) this.form_util().decode_br(data.body);

        try {
            this.loading_btn('[name="compose-form"] [type="submit"]');
            // send req
            let resp = await Http.post(this.api.post_email().slice(0, -1), data);
            this.loading_btn('[name="compose-form"] [type="submit"]', false);
            // show status msg
            this.handle_messages({ data: resp.message || resp.error, type: resp.error ? 'danger' : 'success' });

            if (resp.error) return false;

            // reload tabs counts
            this.set_tabs_count();
            // return to inbox as per requirements
            if (this.emailbox != "sent") new bootstrap.Tab(document.querySelector('#' + history.state?.email_tab.replace(this.emailbox, 'sent')))?.show();

        } catch (error) {
            console.log(error);
            this.handle_messages({ type: 'danger', data: error });
        }
    }

    /**
     * @description handle compose form submit
     * @author AH.SALAH
     * @param {*} [form=null]
     * @returns *
     * @memberof MailApp
     */
    handle_compose_form_submit() {
        this.compose_form = document.querySelector('#compose-form');
        if (!this.compose_form) return false;

        //  on submit
        this.compose_form.addEventListener('submit', e => this.handle_compose_form(e), false);
    }

    /**
     * @description enable bs tooltip
     * @author AH.SALAH
     * @returns bs tooltip eles
     * @memberof MailApp
     */
    enable_tooltip() {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        return tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    /**
     * @description enable bs plugins
     * @author AH.SALAH
     * @memberof MailApp
     */
    enable_bs_plugins() {
        this.enable_tooltip();
    }

    /**
     * @description handle init proccess
     * @author AH.SALAH
     * @memberof MailApp
     */
    async handle_init() {
        try {
            // dom loaded
            await this.get_elements();
            // listen to bs tab change
            this.handle_bs_listeners();
            // initial history state
            this.emit_pushstate_ev(
                'pushstate',
                {
                    email_tab: 'v-pills-inbox-tab',
                    email_type: 'inbox',
                    url: '/emails/inbox/'
                },
                this.curr_emailbox_tab,
                { title: 'email inbox', url: '/emails/inbox/' }
            );
            // handle page title
            this.handle_page_title();

        } catch (error) {
            console.log("handle_init:", error);
        }

    }

    /**
     * @description start app
     * @author AH.SALAH
     * @static
     * @memberof MailApp
     */
    static start() {
        // init app
        // this.on_store_change();
        let mail_app = new MailApp();
        mail_app.handle_state_listener();
        mail_app.get_user_data();
        mail_app.handle_init();
    }

}

// init app
MailApp.start();