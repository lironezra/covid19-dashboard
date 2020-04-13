import React from 'react';

const ListWidget2 = ({ type, title, titleValue, data, listItemClicked }) => {

    return (
        <div className="total-death-wrapper">
            <div className="header">
                <span>{title}</span>
                <span className={`number ${type}`}>{titleValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
            </div>
            <div className="content">
                <ul>
                    {
                        data.sort((a, b) => {
                            return b[type]-a[type];
                        }).map(item => (
                            <li key={item.id} onClick={() => listItemClicked(item.id)}>
                                <span className={`number ${type}`}>{`${item[type].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ${type}`}</span>
                                <span className="country">{item.country}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default ListWidget2;