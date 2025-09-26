import { createElement, useState, useEffect } from "react";
import "./ui/Workflowrolewidget.css";

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

    // Get role type from role item
    const getRoleType = (roleItem) => {
        return props.roleType && props.roleType.get ? props.roleType.get(roleItem)?.value || "" : "";
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

    // Render individual role master item
    const renderRoleItem = (roleItem, isLast = false) => {
        const roleName = getRoleName(roleItem);
        const roleType = getRoleType(roleItem);
        
        return (
            <div key={roleItem.id} className="role-item-container">
                <div className="role-item" onClick={() => handleEditRole(roleItem)}>
                    <div className="role-content">
                        <div className="role-name">{roleName}</div>
                        <div className="role-type">{roleType}</div>
                    </div>
                    
                    <div className="role-actions">
                        {props.showEditButton && (
                            <button 
                                className="edit-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditRole(roleItem);
                                }}
                                title="Edit Role"
                            >
                                ✏️
                            </button>
                        )}
                        
                        {props.showDeleteButton && (
                            <button 
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRole(roleItem);
                                }}
                                title="Delete Role"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
                
                {!isLast && <div className="horizontal-arrow">→</div>}
            </div>
        );
    };

    // Render a group of roles with the same order (horizontal layout)
    const renderOrderGroup = (orderNumber, roleItems) => {
        return (
            <div key={orderNumber} className="order-group">
                <div className="order-label">Order {orderNumber}</div>
                <div className="horizontal-roles">
                    {roleItems.map((roleItem, index) => 
                        renderRoleItem(roleItem, index === roleItems.length - 1)
                    )}
                </div>
            </div>
        );
    };

    // Show loading state
    if (loading) {
        return (
            <div className="workflow-widget-container">
                <div className="loading-state">Loading workflow...</div>
            </div>
        );
    }

    // Show empty state if no roles
    const orderNumbers = Object.keys(groupedRoles).sort((a, b) => parseInt(a) - parseInt(b));
    if (orderNumbers.length === 0) {
        return (
            <div className="workflow-widget-container">
                <div className="empty-state">
                    <div className="no-data-message">No role masters found</div>
                    <div className="no-data-subtitle">Add role masters to see the workflow</div>
                </div>
            </div>
        );
    }

    // Main render - vertical layout of order groups
    return (
        <div className="workflow-widget-container">
            <div className="workflow-content">
                {orderNumbers.map((orderNumber, groupIndex) => (
                    <div key={orderNumber} className="workflow-step">
                        {renderOrderGroup(orderNumber, groupedRoles[orderNumber])}
                        
                        {groupIndex < orderNumbers.length - 1 && (
                            <div className="vertical-arrow">↓</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}