const testsContext = require.context('.', true, /^((?!(\.webpack|fixtures\/)).)*\.js$/);
testsContext.keys().forEach(testsContext);
