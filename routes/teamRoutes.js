const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/add-team',teamController.addTeamEntry);

router.post('/process-result',teamController.processMatchResult);

router.get('/team-result',teamController.viewTeamResult);

module.exports = router;


