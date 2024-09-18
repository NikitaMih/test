import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../Payment.module.css';
import cl from 'classnames';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { CommonData, formTypes } from '../../../common';
import AdminListControls from './AdminListControls';
import { cutUrl } from '../../Helpers/CutUrl';

const List = (props) => {
    const paymentList = useSelector((state) => state.payment.payments);
    const managers = useSelector((state) => state.payment.managers);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    /**
     * Получение бейджей платежа
     * @date 2021-10-12
     * @returns {Array<Badge>}
     */
    const getBadges = (payment) => {
        let badges = [];
        if (payment.oldProject == 2) {
            badges.push(<Badge pill bg="primary">месяц</Badge>)
        }
        if (payment.project) {
            badges.push(<Badge pill bg="danger">к проекту</Badge>)
        }
        if (payment.projectType) {
            Object.keys(CommonData.projectTypes).forEach((projectType) => {
                if (payment.projectType === projectType) {
                    badges.push(<Badge pill bg="warning" text="dark">{CommonData.projectTypes[projectType]}</Badge>)
                }
            })
        }
        return badges;
    };

    return (
       <div>
           {paymentList.map((payment, index) => (
                !!payment ? 
                <Row key={index} className={'payment-row ' + (payment.status == 1 ? cl(styles.payment_list__row) + ' ' + cl(styles.payment_list__row_good) : cl(styles.payment_list__row))}>
                    <Col className='total' md={1}>
                        <span className={payment.total_minus > 0 ? cl(styles.red_text) : cl(styles.green_text)}>
                            {payment.total_minus > 0 ? '-'+payment.total_minus : payment.total} 
                        </span>
                        {payment.total_minus > 0 ?
                            payment.cost_type === "direct" ?  <Badge pill bg="light" text="dark">прямой</Badge> :
                                payment.cost_type === "indirect" ? <Badge pill bg="secondary" text="light">косв</Badge> : ''
                        : ''}
                        {payment.total_free ? 
                        <span>
                            /{payment.total_free}
                        </span>
                        : null}
                        {payment.full_sum && payment.total_minus === 0 ?
                            <div className={cl(styles.purple_text) + " full_sum"}>{payment.full_sum}</div>
                        : null}
                        {
                            payment.status === 1 && <span className={styles.payment__date}>{payment.date_upd.slice(0, 10)}</span>
                        }
                       
                    </Col>
                    <Col md={2}>
                        <span className="category">{payment.category}</span> <span className="contragent">{payment.contragent}</span> <br></br>
                        Сайт: <span className="site">{payment.site}</span>
                        <br /> {payment.entity !== "undefined" ?
                            payment.entity == 1 ?
                                <Badge pill bg="light" text="dark">ООО</Badge> : <Badge pill bg="light" text="dark">ИП</Badge> : ''}
                        </Col>
                    <Col md={2}>
                        <div>
                            {payment.planfix_id ?
                                <a href={`https://alto.planfix.ru/?action=taskview&id=${payment.planfix_id}`} target="_blank" rel="noreferrer"> {payment.project}</a>
                                :  payment.project
                            }
                        </div>
                        <div>
                            {getBadges(payment).map((badge, index) => (
                                <React.Fragment key={index}>
                                    <span className="badge-block">{badge}</span>
                                </React.Fragment>
                            ))}
                            {payment.daysProject && CommonData.daysTypes[payment.daysType] && parseInt(payment.total_minus) <= 0 ? 
                                <span className={(getBadges(payment).length ? "ms-2": "") + " days"}>{payment.daysProject} {CommonData.daysTypes[payment.daysType]}</span>
                            : null}
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className={cl(styles.payment_smaller_text)}>
                            <span className="comment">{payment.comment}</span>
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="11" viewBox="0 0 13 11" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.5 3.0625C6.5 3.49348 6.3288 3.9068 6.02405 4.21155C5.7193 4.5163 5.30598 4.6875 4.875 4.6875C4.44402 4.6875 4.0307 4.5163 3.72595 4.21155C3.4212 3.9068 3.25 3.49348 3.25 3.0625C3.25 2.63152 3.4212 2.2182 3.72595 1.91345C4.0307 1.6087 4.44402 1.4375 4.875 1.4375C5.30598 1.4375 5.7193 1.6087 6.02405 1.91345C6.3288 2.2182 6.5 2.63152 6.5 3.0625ZM4.875 5.5C5.52147 5.5 6.14145 5.24319 6.59857 4.78607C7.05569 4.32895 7.3125 3.70897 7.3125 3.0625C7.3125 2.41603 7.05569 1.79605 6.59857 1.33893C6.14145 0.881807 5.52147 0.625 4.875 0.625C4.22853 0.625 3.60855 0.881807 3.15143 1.33893C2.69431 1.79605 2.4375 2.41603 2.4375 3.0625C2.4375 3.70897 2.69431 4.32895 3.15143 4.78607C3.60855 5.24319 4.22853 5.5 4.875 5.5ZM9.75 9.5625C9.75 10.375 8.9375 10.375 8.9375 10.375H0.8125C0.8125 10.375 0 10.375 0 9.5625C0 8.75 0.8125 6.3125 4.875 6.3125C8.9375 6.3125 9.75 8.75 9.75 9.5625ZM8.9375 9.55925C8.93669 9.35938 8.81238 8.75812 8.2615 8.20725C7.73175 7.6775 6.73481 7.125 4.875 7.125C3.01437 7.125 2.01825 7.6775 1.4885 8.20725C0.937625 8.75812 0.814125 9.35938 0.8125 9.55925H8.9375ZM10.9688 3.0625C11.0765 3.0625 11.1798 3.1053 11.256 3.18149C11.3322 3.25767 11.375 3.36101 11.375 3.46875V4.6875H12.5938C12.7015 4.6875 12.8048 4.7303 12.881 4.80649C12.9572 4.88267 13 4.98601 13 5.09375C13 5.20149 12.9572 5.30483 12.881 5.38101C12.8048 5.4572 12.7015 5.5 12.5938 5.5H11.375V6.71875C11.375 6.82649 11.3322 6.92983 11.256 7.00601C11.1798 7.0822 11.0765 7.125 10.9688 7.125C10.861 7.125 10.7577 7.0822 10.6815 7.00601C10.6053 6.92983 10.5625 6.82649 10.5625 6.71875V5.5H9.34375C9.23601 5.5 9.13267 5.4572 9.05649 5.38101C8.9803 5.30483 8.9375 5.20149 8.9375 5.09375C8.9375 4.98601 8.9803 4.88267 9.05649 4.80649C9.13267 4.7303 9.23601 4.6875 9.34375 4.6875H10.5625V3.46875C10.5625 3.36101 10.6053 3.25767 10.6815 3.18149C10.7577 3.1053 10.861 3.0625 10.9688 3.0625Z" fill="black"/>
                            </svg>
                            <span className="from">{payment.from}</span>
                        </div>
                        {payment.money_to ?
                            <div>
                                <Badge pill bg="secondary">Отдать {payment.money_to}</Badge>
                            </div>
                        : null}
                    </Col>
                    <Col md={4}>
                        {payment.percents.map((percent, index) => (
                            <div key={index} className={cl(styles.payment_smaller_text)}>
                            {percent.name === 'Продажа' ?
                                <div>
                                    <b>Продажа</b>: {percent.manager}{' '}
                                    {isAdmin && payment.total_minus === 0 ?
                                        <div>
                                            <b>({!!managers[percent.manager] ? managers[percent.manager]['percents']['Продажа'] + '%': null})</b>
                                            <b>{!!managers[percent.manager] ? managers[percent.manager]['percents']['total']:  'нет'}
                                            </b>
                                        </div>
                                    : null}
                                </div>
                            : null}

                            {percent.name === 'Ведение' ?
                                <div>
                                    <b className='test'>Ведение</b>: {percent.manager}{' '}
                                    {isAdmin && payment.total_minus === 0 ?
                                        <b>({!!managers[percent.manager] ? managers[percent.manager]['percents']['Ведение'] + '%': null})</b>
                                    : null}
                                </div>
                            : null}
                            </div>
                        ))}
                        {isAdmin ?
                            <AdminListControls index={index} payment={payment} />
                        :null}
                    </Col>
                    <Col md={1}>
                        <div className={cl(styles.payment_list__controls__container)}>
                            <div onClick={() => props.editPayment(payment, index)} className={cl(styles.payment_list__controls)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.15 0.131269C12.1965 0.0847055 12.2516 0.0477627 12.3124 0.0225562C12.3731 -0.0026502 12.4382 -0.015625 12.504 -0.015625C12.5698 -0.015625 12.6349 -0.0026502 12.6956 0.0225562C12.7564 0.0477627 12.8116 0.0847055 12.858 0.131269L15.858 3.13127C15.9046 3.17771 15.9415 3.23289 15.9667 3.29363C15.9919 3.35438 16.0049 3.4195 16.0049 3.48527C16.0049 3.55104 15.9919 3.61616 15.9667 3.6769C15.9415 3.73765 15.9046 3.79282 15.858 3.83927L5.85802 13.8393C5.81003 13.8869 5.75288 13.9243 5.69002 13.9493L0.690017 15.9493C0.599154 15.9856 0.499613 15.9945 0.403737 15.9749C0.307861 15.9552 0.219865 15.9078 0.150658 15.8386C0.0814517 15.7694 0.0340782 15.6814 0.0144108 15.5855C-0.00525667 15.4897 0.00364683 15.3901 0.0400175 15.2993L2.04002 10.2993C2.06495 10.2364 2.10237 10.1793 2.15002 10.1313L12.15 0.131269ZM11.211 2.48527L13.504 4.77827L14.797 3.48527L12.504 1.19227L11.211 2.48527ZM12.797 5.48527L10.504 3.19227L4.00402 9.69227V9.98527H4.50402C4.63662 9.98527 4.7638 10.0379 4.85757 10.1317C4.95134 10.2255 5.00402 10.3527 5.00402 10.4853V10.9853H5.50402C5.63662 10.9853 5.7638 11.0379 5.85757 11.1317C5.95134 11.2255 6.00402 11.3527 6.00402 11.4853V11.9853H6.29702L12.797 5.48527ZM3.03602 10.6603L2.93002 10.7663L1.40202 14.5873L5.22302 13.0593L5.32902 12.9533C5.23364 12.9176 5.15141 12.8537 5.09333 12.7701C5.03525 12.6865 5.00409 12.5871 5.00402 12.4853V11.9853H4.50402C4.37141 11.9853 4.24423 11.9326 4.15046 11.8388C4.0567 11.7451 4.00402 11.6179 4.00402 11.4853V10.9853H3.50402C3.4022 10.9852 3.30283 10.954 3.21919 10.896C3.13556 10.8379 3.07165 10.7556 3.03602 10.6603Z" fill="#007BFF"/>
                                </svg>
                            </div>

                            {!payment.status ?
                            <div onClick={() => props.showDeletePaymentConfirmation(index)} className={cl(styles.payment_list__controls) + " delete_button"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14 1H2C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V2C15 1.73478 14.8946 1.48043 14.7071 1.29289C14.5196 1.10536 14.2652 1 14 1ZM2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H14C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V2C16 1.46957 15.7893 0.960859 15.4142 0.585786C15.0391 0.210714 14.5304 0 14 0L2 0Z" fill="#C50713"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.64683 4.64592C4.69328 4.59935 4.74845 4.56241 4.8092 4.5372C4.86994 4.512 4.93507 4.49902 5.00083 4.49902C5.0666 4.49902 5.13172 4.512 5.19247 4.5372C5.25321 4.56241 5.30839 4.59935 5.35483 4.64592L8.00083 7.29292L10.6468 4.64592C10.6933 4.59943 10.7485 4.56255 10.8092 4.53739C10.87 4.51223 10.9351 4.49929 11.0008 4.49929C11.0666 4.49929 11.1317 4.51223 11.1924 4.53739C11.2532 4.56255 11.3083 4.59943 11.3548 4.64592C11.4013 4.6924 11.4382 4.74759 11.4634 4.80833C11.4885 4.86907 11.5015 4.93417 11.5015 4.99992C11.5015 5.06566 11.4885 5.13076 11.4634 5.1915C11.4382 5.25224 11.4013 5.30743 11.3548 5.35392L8.70783 7.99992L11.3548 10.6459C11.4013 10.6924 11.4382 10.7476 11.4634 10.8083C11.4885 10.8691 11.5015 10.9342 11.5015 10.9999C11.5015 11.0657 11.4885 11.1308 11.4634 11.1915C11.4382 11.2522 11.4013 11.3074 11.3548 11.3539C11.3083 11.4004 11.2532 11.4373 11.1924 11.4624C11.1317 11.4876 11.0666 11.5005 11.0008 11.5005C10.9351 11.5005 10.87 11.4876 10.8092 11.4624C10.7485 11.4373 10.6933 11.4004 10.6468 11.3539L8.00083 8.70692L5.35483 11.3539C5.30834 11.4004 5.25316 11.4373 5.19242 11.4624C5.13168 11.4876 5.06658 11.5005 5.00083 11.5005C4.93509 11.5005 4.86999 11.4876 4.80925 11.4624C4.74851 11.4373 4.69332 11.4004 4.64683 11.3539C4.60034 11.3074 4.56347 11.2522 4.53831 11.1915C4.51315 11.1308 4.5002 11.0657 4.5002 10.9999C4.5002 10.9342 4.51315 10.8691 4.53831 10.8083C4.56347 10.7476 4.60034 10.6924 4.64683 10.6459L7.29383 7.99992L4.64683 5.35392C4.60027 5.30747 4.56333 5.2523 4.53812 5.19155C4.51291 5.13081 4.49994 5.06568 4.49994 4.99992C4.49994 4.93415 4.51291 4.86903 4.53812 4.80828C4.56333 4.74754 4.60027 4.69236 4.64683 4.64592Z" fill="#C50713"/>
                                    </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="16" height="16" fill="white"/>
                                    </clipPath>
                                </defs>
                                </svg>
                            </div>
                            : null}

                            <div onClick={() => props.copyPaymentToForm(payment)} className={cl(styles.payment_list__controls)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4 2H11C11.5304 2 12.0391 2.21071 12.4142 2.58579C12.7893 2.96086 13 3.46957 13 4V14C13 14.5304 12.7893 15.0391 12.4142 15.4142C12.0391 15.7893 11.5304 16 11 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2ZM4 3C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V14C3 14.2652 3.10536 14.5196 3.29289 14.7071C3.48043 14.8946 3.73478 15 4 15H11C11.2652 15 11.5196 14.8946 11.7071 14.7071C11.8946 14.5196 12 14.2652 12 14V4C12 3.73478 11.8946 3.48043 11.7071 3.29289C11.5196 3.10536 11.2652 3 11 3H4Z" fill="#007BFF"/>
                                    <path d="M6 0H13C13.5304 0 14.0391 0.210714 14.4142 0.585786C14.7893 0.960859 15 1.46957 15 2V12C15 12.5304 14.7893 13.0391 14.4142 13.4142C14.0391 13.7893 13.5304 14 13 14V13C13.2652 13 13.5196 12.8946 13.7071 12.7071C13.8946 12.5196 14 12.2652 14 12V2C14 1.73478 13.8946 1.48043 13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1H6C5.73478 1 5.48043 1.10536 5.29289 1.29289C5.10536 1.48043 5 1.73478 5 2H4C4 1.46957 4.21071 0.960859 4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0V0Z" fill="#007BFF"/>
                                </svg>
                            </div>
                        </div>
                    </Col>
                </Row>
                : null
            ))}
       </div>
    );
}

const isEqual = (prevProps, nextProps) => {
    return true;
}

//С текущим объемом данных, нельзя допускать ререндеров
export default React.memo(List, isEqual);