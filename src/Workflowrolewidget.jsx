import { createElement, useState, useEffect } from "react";
import "./ui/Workflowrolewidget.css";
import adUserIcon from './assets/images/images__4_.png'
import nonAdUserIcon from './assets/images/approve.jpg'
import isApproveIcon from './assets/images/circle_check_tick_correct.svg'
import isRejectIcon from './assets/images/circle_clear_cross_cancel.svg'
import isReturnIcon from './assets/images/refresh_2.svg'

export function Workflowrolewidget(props) {
    const [groupedRoles, setGroupedRoles] = useState({});
    const [loading, setLoading] = useState(true);
    // Process the role data when it changes
    useEffect(() => {
        if (props.roleDataSource && props.roleDataSource.status === "available") {
            const roles = props.roleDataSource.items || [];
            
            // Group roles by order number
            const grouped = groupRolesByOrder(roles);
            setGroupedRoles(grouped);
            setLoading(false);
        } else if (props.roleDataSource && props.roleDataSource.status === "loading") {
            setLoading(true);
        }
    }, [props.roleDataSource]);

    // Function to group roles by their order number
    const groupRolesByOrder = (roles) => {
        const groups = {};
        
        roles.forEach(roleItem => {
            // Get the order value from the role item
            const orderValue = props.orderNumber && props.orderNumber.get ? props.orderNumber.get(roleItem)?.value : null;
            
            if (orderValue !== undefined && orderValue !== null) {
                // If this order doesn't exist in groups, create an array
                if (!groups[orderValue]) {
                    groups[orderValue] = [];
                }
                groups[orderValue].push(roleItem);
            }
        });
        
        return groups;
    };

    // Get role name from role item
    const getRoleName = (roleItem) => {
        return props.roleName && props.roleName.get ? props.roleName.get(roleItem)?.value || "Unnamed Role" : "Unnamed Role";
    };

    //Get role type from role item
    const getRoleType = (roleItem) => {
        return props.roleType && props.roleType.get ? props.roleType.get(roleItem)?.value || "" : "";
    };


    // Get userFromAD boolean from role item
    const getUserFromAD = (roleItem) => {
       return props.userFromAD && props.userFromAD.get ? props.userFromAD.get(roleItem)?.value || false : false;
    };

// Get ableToApprove boolean from role item
const getAbleToApprove = (roleItem) => {
    return props.ableToApprove && props.ableToApprove.get ? props.ableToApprove.get(roleItem)?.value || false : false;
};

// Get ableToReject boolean from role item
const getAbleToReject = (roleItem) => {
    return props.ableToReject && props.ableToReject.get ? props.ableToReject.get(roleItem)?.value || false : false;
};

// Get ableToReturn boolean from role item
const getAbleToReturn = (roleItem) => {
    return props.ableToReturn && props.ableToReturn.get ? props.ableToReturn.get(roleItem)?.value || false : false;
};

    // Handle edit role action
    const handleEditRole = (roleItem) => {
        if (props.onClickAction && props.onClickAction.get && props.onClickAction.get(roleItem)) {
            const action = props.onClickAction.get(roleItem);
            if (action.canExecute) {
                action.execute();
            }
        }
    };

    // Handle delete role action
    const handleDeleteRole = (roleItem) => {
        if (props.onDeleteAction && props.onDeleteAction.get && props.onDeleteAction.get(roleItem)) {
            const action = props.onDeleteAction.get(roleItem);
            if (action.canExecute) {
                action.execute();
            }
        }
    };

    // Handle non-AD user icon click action
    const handleNonADUserIconClick = (roleItem) => {
        if (props.onNonADUserIconClick && props.onNonADUserIconClick.get && props.onNonADUserIconClick.get(roleItem)) {
            const action = props.onNonADUserIconClick.get(roleItem);
            if (action.canExecute) {
                action.execute();
            }
        }
    };


// Render individual role master item
//This function is used to render each role master card
const renderRoleItem = (roleItem, orderNumber, isLastGroup) => {
    const roleName = getRoleName(roleItem);
    const roleType = getRoleType(roleItem);
    const userFromAD = getUserFromAD(roleItem);
    const ableToApprove = getAbleToApprove(roleItem);
    const ableToReject = getAbleToReject(roleItem);
    const ableToReturn = getAbleToReturn(roleItem);
    
    // Check if role type is "Approver" (case-insensitive)
    const isApprover = roleType && roleType.toLowerCase() === "approver";
    
    return (
        <div key={roleItem.id} className="role-item-container">
            <div className="role-item-wrapper">
                {/* dont show the order number for the last order group */}
                {!isLastGroup && <div className="role-order-badge">{orderNumber}</div>}
                <div className="role-item" onClick={() => handleEditRole(roleItem)}>
                    {/* Role Name at Top */}
                    <div className="role-name">{roleName}</div>
                    
                    {/* Bottom Section with Left and Right divs */}
                    <div className="role-bottom-section">
                        {/* Left Bottom: Action Icons (Approve, Reject, Return) */}
                        <div className="left-bottom-icons">
                            {isApprover && ableToApprove && (
                                <img 
                                    src={isApproveIcon} 
                                    alt="Can Approve" 
                                    className="action-icon approve-icon"
                                    title="Can Approve"
                                />
                            )}
                            {isApprover && ableToReturn && (
                                <img 
                                    src={isReturnIcon} 
                                    alt="Can Return" 
                                    className="action-icon return-icon"
                                    title="Can Return"
                                />
                            )}
                            {isApprover && ableToReject && (
                                <img 
                                    src={isRejectIcon} 
                                    alt="Can Reject" 
                                    className="action-icon reject-icon"
                                    title="Can Reject"
                                />
                            )}
                        </div>
                        
                        {/* Right Bottom: User Icon + Delete Button */}
                        <div className="right-bottom-icons">
                            {isApprover && (
                                <img 
                                    src={userFromAD ? adUserIcon : nonAdUserIcon} 
                                    alt={userFromAD ? "AD User" : "Non-AD User"}
                                    className={`user-icon ${!userFromAD ? 'clickable-user-icon' : ''}`}
                                    onClick={(e) => {
                                        if (!userFromAD) {
                                           e.stopPropagation();
                                           handleNonADUserIconClick(roleItem);
                                        }
                                    }}
                                />
                            )}
                            <button 
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRole(roleItem);
                                }}
                            >
                                <svg 
                                    width="22" 
                                    height="22" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#dc2626" 
                                    strokeWidth="2"
                                >
                                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render a group of roles with the same order (horizontal layout)
// This function handles the horizantol flow 
   const renderOrderGroup = (orderNumber, roleItems, isLastGroup) => {
    return (
        <div key={orderNumber} className="order-group">
            {/* <div className="order-label">{orderNumber}</div> */}
            <div className="horizontal-roles">
                {roleItems.map((roleItem, index) => 
                    renderRoleItem(roleItem, orderNumber, isLastGroup) // Pass orderNumber here
                )}
            </div>
        </div>
    );
};


// Show empty state if no roles
const orderNumbers = Object.keys(groupedRoles).sort((a, b) => parseInt(a) - parseInt(b));

if (orderNumbers.length === 0) {
    return (
        <div className="workflow-widget-container">
            <div className="empty-state">
                {/* Use Mendix internal image if no custom image is provided */}
                <img 
                    src={props.emptyStateImage?.value?.uri} 
                    alt="No Data" 
                    className="no-data-image" 
                    style={{height: '420px'}}
                />
            </div>
        </div>
    );
}

    // Main render - vertical layout of order groups
    //This adds the vertical arrow between the order groups(main render)
    return (
        <div className="workflow-widget-container">
            <div className="workflow-content">
                {orderNumbers.map((orderNumber, groupIndex) => (
                    <div key={orderNumber} className="workflow-step">
                        {renderOrderGroup(orderNumber, groupedRoles[orderNumber], groupIndex === orderNumbers.length-1)}
                        
                        {groupIndex < orderNumbers.length - 1 && (
                            <div className="vertical-arrow">↓</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}