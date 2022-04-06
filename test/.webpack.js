const testsContext = require.context('.', true, /^((?!(\.webpack)).)*\.js$/);
testsContext.keys().forEach(testsContext);
