import React from 'react';

const ListWidget = ({ title, data, type, listItemClicked }) => {

    return (
        <div className="list-wrapper">
            <div className="list-header">
              <p>{title}</p>
            </div>
            <div className="list-content">
                <ul>
                    {
                        data.sort((a, b) => {
                            return b[type]-a[type];
                        }).map((item) => {
                                return <li key={item.id}  onClick={() => listItemClicked(item.id)}>
                                    <span className="number">{item[type].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
                                    <span className="country">{item.country}</span>
                                </li>
                            }
                        )
                    }
                </ul>
            </div>
        </div>
    );
};

export default ListWidget;