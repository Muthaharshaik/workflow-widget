const base = require("@mendix/pluggable-widgets-tools/configs/eslint.js.base.json");

module.exports = {
    ...base,
    rules: {
        "no-unused-vars": "off",
        "no-console": "off",
        "react/prop-types": "off"
    }
};
