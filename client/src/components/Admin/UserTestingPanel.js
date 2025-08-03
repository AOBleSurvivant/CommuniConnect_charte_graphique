import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  CheckCircle,
  Error,
  Warning,
  Info,
  Timer,
  Speed,
  TrendingUp,
  Feedback,
  Assignment,
  Visibility,
  ThumbUp,
  ThumbDown,
  Star,
  StarBorder
} from '@mui/icons-material';

const UserTestingPanel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedback, setFeedback] = useState({});
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Scénarios de test réalistes
  const scenarios = [
    {
      id: 1,
      title: "Gestion des contributeurs en attente",
      description: "En tant qu'admin, vous devez examiner et approuver les nouvelles candidatures de contributeurs.",
      tasks: [
        "Naviguer vers l'onglet Contributeurs",
        "Identifier les candidatures en attente",
        "Examiner les informations d'un contributeur",
        "Approuver une candidature avec une raison",
        "Rejeter une candidature avec une raison"
      ],
      expectedTime: 180, // 3 minutes
      difficulty: "Facile"
    },
    {
      id: 2,
      title: "Modération de publications signalées",
      description: "Traiter les signalements de publications inappropriées ou incorrectes.",
      tasks: [
        "Naviguer vers l'onglet Signalements",
        "Examiner les détails d'un signalement",
        "Vérifier la publication signalée",
        "Prendre une décision (bloquer/débloquer)",
        "Documenter la raison de la décision"
      ],
      expectedTime: 240, // 4 minutes
      difficulty: "Moyen"
    },
    {
      id: 3,
      title: "Recherche et filtrage avancé",
      description: "Utiliser les fonctionnalités de recherche et filtrage pour trouver rapidement des éléments spécifiques.",
      tasks: [
        "Utiliser la barre de recherche pour trouver un contributeur",
        "Filtrer par statut (en attente, approuvé, rejeté)",
        "Filtrer les publications par catégorie",
        "Combiner plusieurs filtres",
        "Réinitialiser les filtres"
      ],
      expectedTime: 120, // 2 minutes
      difficulty: "Facile"
    },
    {
      id: 4,
      title: "Gestion des publications bloquées",
      description: "Examiner et gérer les publications qui ont été bloquées pour violation des règles.",
      tasks: [
        "Naviguer vers l'onglet Publications",
        "Identifier les publications bloquées",
        "Examiner les raisons du blocage",
        "Débloquer une publication si approprié",
        "Maintenir le blocage si nécessaire"
      ],
      expectedTime: 180, // 3 minutes
      difficulty: "Moyen"
    },
    {
      id: 5,
      title: "Vue d'ensemble et statistiques",
      description: "Analyser les métriques et statistiques du tableau de bord pour prendre des décisions éclairées.",
      tasks: [
        "Examiner les cartes de statistiques",
        "Interpréter les barres de progression",
        "Identifier les priorités (badges)",
        "Comprendre les ratios et tendances",
        "Utiliser les informations pour la planification"
      ],
      expectedTime: 150, // 2.5 minutes
      difficulty: "Facile"
    }
  ];

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startTest = (scenario) => {
    setCurrentScenario(scenario);
    setActiveStep(0);
    setIsRunning(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setFeedback({});
  };

  const stopTest = () => {
    setIsRunning(false);
    setShowFeedbackDialog(true);
  };

  const handleStepComplete = () => {
    if (activeStep < currentScenario.tasks.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      stopTest();
    }
  };

  const handleFeedbackSubmit = () => {
    const testResult = {
      id: Date.now(),
      scenario: currentScenario,
      duration: elapsedTime,
      feedback: feedback,
      completedAt: new Date(),
      performance: calculatePerformance()
    };

    setTestResults([...testResults, testResult]);
    setShowFeedbackDialog(false);
    setCurrentScenario(null);
    setIsRunning(false);
    setFeedback({});
  };

  const calculatePerformance = () => {
    if (!currentScenario) return 0;
    const expectedTime = currentScenario.expectedTime * 1000; // Convert to ms
    const efficiency = Math.max(0, 100 - ((elapsedTime - expectedTime) / expectedTime) * 100);
    return Math.min(100, Math.max(0, efficiency));
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return 'success';
      case 'Moyen': return 'warning';
      case 'Difficile': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Tests Utilisateur - Tableau de Bord Admin
      </Typography>

      {!isRunning ? (
        // Sélection des scénarios
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="h6">Instructions</Typography>
              <Typography variant="body2">
                Sélectionnez un scénario de test pour évaluer l'expérience utilisateur du tableau de bord admin.
                Chaque test mesure le temps d'exécution et collecte votre feedback.
              </Typography>
            </Alert>
          </Grid>

          {scenarios.map((scenario) => (
            <Grid item xs={12} md={6} key={scenario.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {scenario.title}
                    </Typography>
                    <Chip 
                      label={scenario.difficulty} 
                      color={getDifficultyColor(scenario.difficulty)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {scenario.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tâches à accomplir :
                    </Typography>
                    <List dense>
                      {scenario.tasks.map((task, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Typography variant="caption" color="text.secondary">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText 
                            primary={task} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ⏱️ Temps estimé : {scenario.expectedTime / 60} min
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => startTest(scenario)}
                    >
                      Commencer le test
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Interface de test en cours
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Test en cours : {currentScenario.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  icon={<Timer />} 
                  label={formatTime(elapsedTime)} 
                  color="primary" 
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopTest}
                >
                  Terminer le test
                </Button>
              </Box>
            </Box>

            <LinearProgress 
              variant="determinate" 
              value={(activeStep / currentScenario.tasks.length) * 100}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary">
              Progression : {activeStep + 1} / {currentScenario.tasks.length} tâches
            </Typography>
          </Paper>

          <Stepper activeStep={activeStep} orientation="vertical">
            {currentScenario.tasks.map((task, index) => (
              <Step key={index}>
                <StepLabel>
                  <Typography variant="subtitle1">
                    Tâche {index + 1} : {task}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Effectuez cette tâche dans l'interface du tableau de bord.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleStepComplete}
                      disabled={index !== activeStep}
                    >
                      {index === currentScenario.tasks.length - 1 ? 'Terminer' : 'Tâche suivante'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Dialog de feedback */}
      <Dialog open={showFeedbackDialog} onClose={() => setShowFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Feedback - {currentScenario?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2">
                  Temps d'exécution : {formatTime(elapsedTime)}
                </Typography>
                <Typography variant="body2">
                  Temps estimé : {formatTime(currentScenario?.expectedTime * 1000)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculatePerformance()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                Efficacité : {Math.round(calculatePerformance())}%
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Facilité d'utilisation
              </Typography>
              <Rating
                value={feedback.easeOfUse || 0}
                onChange={(event, newValue) => {
                  setFeedback({ ...feedback, easeOfUse: newValue });
                }}
                size="large"
              />
              <Typography variant="caption" color="text.secondary">
                {feedback.easeOfUse === 1 && "Très difficile"}
                {feedback.easeOfUse === 2 && "Difficile"}
                {feedback.easeOfUse === 3 && "Moyen"}
                {feedback.easeOfUse === 4 && "Facile"}
                {feedback.easeOfUse === 5 && "Très facile"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Satisfaction globale
              </Typography>
              <Rating
                value={feedback.satisfaction || 0}
                onChange={(event, newValue) => {
                  setFeedback({ ...feedback, satisfaction: newValue });
                }}
                size="large"
              />
              <Typography variant="caption" color="text.secondary">
                {feedback.satisfaction === 1 && "Très insatisfait"}
                {feedback.satisfaction === 2 && "Insatisfait"}
                {feedback.satisfaction === 3 && "Neutre"}
                {feedback.satisfaction === 4 && "Satisfait"}
                {feedback.satisfaction === 5 && "Très satisfait"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaires et suggestions"
                value={feedback.comments || ''}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                placeholder="Partagez vos impressions, difficultés rencontrées, suggestions d'amélioration..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Problèmes rencontrés
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Interface confuse', 'Navigation difficile', 'Actions non trouvées', 'Temps de chargement', 'Erreurs techniques', 'Autre'].map((problem) => (
                  <Chip
                    key={problem}
                    label={problem}
                    variant={feedback.problems?.includes(problem) ? "filled" : "outlined"}
                    onClick={() => {
                      const problems = feedback.problems || [];
                      const newProblems = problems.includes(problem)
                        ? problems.filter(p => p !== problem)
                        : [...problems, problem];
                      setFeedback({ ...feedback, problems: newProblems });
                    }}
                    color={feedback.problems?.includes(problem) ? "error" : "default"}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeedbackDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleFeedbackSubmit} variant="contained">
            Soumettre le feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            📊 Résultats des Tests
          </Typography>
          
          <Grid container spacing={2}>
            {testResults.map((result) => (
              <Grid item xs={12} md={6} key={result.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">
                        {result.scenario.title}
                      </Typography>
                      <Chip 
                        label={`${Math.round(result.performance)}%`}
                        color={result.performance >= 80 ? 'success' : result.performance >= 60 ? 'warning' : 'error'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ⏱️ {formatTime(result.duration)} | ⭐ {result.feedback.satisfaction || 0}/5
                    </Typography>

                    {result.feedback.comments && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{result.feedback.comments}"
                      </Typography>
                    )}

                    {result.feedback.problems?.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="error">
                          Problèmes : {result.feedback.problems.join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserTestingPanel; 