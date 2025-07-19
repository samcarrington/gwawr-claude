/**
 * Contentful Migration Orchestrator
 *
 * This script provides a unified interface for executing all migration phases
 * with proper error handling, logging, and rollback capabilities.
 */

const { createClient } = require('contentful-management');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Validate environment variables
if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   CONTENTFUL_SPACE_ID');
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN');
  process.exit(1);
}

// Migration phases configuration
const MIGRATION_PHASES = {
  phase1: {
    name: 'Content Type Enhancement',
    description: 'Add new fields to content types',
    script: 'migration-phase-1-comprehensive.cjs',
    estimatedTime: '5-10 minutes',
    critical: true,
  },
  phase2: {
    name: 'Data Population',
    description: 'Populate new fields with data',
    script: 'migration-phase-2-data-population.cjs',
    estimatedTime: '15-30 minutes',
    critical: true,
  },
  phase3: {
    name: 'Field Requirements Update',
    description: 'Make critical fields required',
    script: 'migration-phase-3-field-requirements.cjs',
    estimatedTime: '5-10 minutes',
    critical: false,
  },
  phase4: {
    name: 'Application Integration',
    description: 'Manual application updates',
    script: 'migration-phase-4-application-integration.md',
    estimatedTime: '2-3 weeks',
    critical: false,
    manual: true,
  },
};

class MigrationOrchestrator {
  constructor() {
    this.client = null;
    this.space = null;
    this.environment = null;
    this.logFile = null;
    this.startTime = null;
    this.results = {};
  }

  async initialize() {
    console.log('🚀 Initializing Migration Orchestrator...');

    // Create log file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFile = path.join(__dirname, `migration-log-${timestamp}.log`);

    // Initialize Contentful client
    this.client = createClient({
      accessToken: MANAGEMENT_TOKEN,
    });

    this.space = await this.client.getSpace(SPACE_ID);
    this.environment = await this.space.getEnvironment(ENVIRONMENT);

    console.log(`✅ Connected to space: ${this.space.name} (${SPACE_ID})`);
    console.log(`🌍 Environment: ${ENVIRONMENT}`);
    console.log(`📝 Log file: ${this.logFile}`);

    this.log('Migration orchestrator initialized');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    if (this.logFile) {
      fs.appendFileSync(this.logFile, logEntry);
    }

    console.log(message);
  }

  async createBackup() {
    console.log('\n📦 Creating pre-migration backup...');

    try {
      // Backup content types
      const contentTypes = await this.environment.getContentTypes();
      const contentTypesBackup = {
        timestamp: new Date().toISOString(),
        environment: ENVIRONMENT,
        contentTypes: contentTypes.items.map(ct => ({
          sys: ct.sys,
          name: ct.name,
          description: ct.description,
          displayField: ct.displayField,
          fields: ct.fields,
        })),
      };

      const backupFile = path.join(
        __dirname,
        `backup-content-types-${Date.now()}.json`
      );
      fs.writeFileSync(backupFile, JSON.stringify(contentTypesBackup, null, 2));

      this.log(`✅ Content types backed up to ${backupFile}`);
      return backupFile;
    } catch (error) {
      this.log(`❌ Backup failed: ${error.message}`);
      throw error;
    }
  }

  async validatePrerequisites() {
    console.log('\n🔍 Validating prerequisites...');

    const checks = [
      {
        name: 'Environment variables',
        check: () => SPACE_ID && MANAGEMENT_TOKEN,
        message:
          'CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set',
      },
      {
        name: 'Contentful connection',
        check: async () => {
          try {
            await this.environment.getContentTypes();
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'Cannot connect to Contentful',
      },
      {
        name: 'Required content types',
        check: async () => {
          const contentTypes = await this.environment.getContentTypes();
          const requiredTypes = ['blogPost', 'project', 'testimonial'];
          const existingTypes = contentTypes.items.map(ct => ct.sys.id);

          return requiredTypes.every(type => existingTypes.includes(type));
        },
        message:
          'Required content types (blogPost, project, testimonial) not found',
      },
    ];

    for (const check of checks) {
      try {
        const result = await check.check();
        if (result) {
          this.log(`   ✅ ${check.name}`);
        } else {
          this.log(`   ❌ ${check.name}: ${check.message}`);
          return false;
        }
      } catch (error) {
        this.log(`   ❌ ${check.name}: ${error.message}`);
        return false;
      }
    }

    this.log('✅ All prerequisites validated');
    return true;
  }

  async executePhase(phaseId, options = {}) {
    const phase = MIGRATION_PHASES[phaseId];
    if (!phase) {
      throw new Error(`Unknown phase: ${phaseId}`);
    }

    console.log(`\n🔄 Executing ${phase.name}...`);
    console.log(`📋 Description: ${phase.description}`);
    console.log(`⏱️  Estimated time: ${phase.estimatedTime}`);

    const startTime = Date.now();
    this.log(`Starting ${phase.name} (${phaseId})`);

    try {
      if (phase.manual) {
        console.log(
          '📖 This is a manual phase. Please refer to the documentation:'
        );
        console.log(`   📄 ${phase.script}`);

        if (!options.skipConfirmation) {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          await new Promise(resolve => {
            rl.question(
              'Press Enter when manual tasks are completed...',
              () => {
                rl.close();
                resolve();
              }
            );
          });
        }

        this.results[phaseId] = {
          success: true,
          duration: Date.now() - startTime,
          manual: true,
        };
      } else {
        // Execute the script
        const scriptPath = path.join(__dirname, phase.script);

        if (!fs.existsSync(scriptPath)) {
          throw new Error(`Script not found: ${scriptPath}`);
        }

        console.log(`🏃 Running: node ${scriptPath}`);

        const result = execSync(`node ${scriptPath}`, {
          cwd: __dirname,
          stdio: 'inherit',
          env: { ...process.env },
        });

        this.results[phaseId] = {
          success: true,
          duration: Date.now() - startTime,
        };
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.log(`✅ ${phase.name} completed successfully in ${duration}s`);
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.log(`❌ ${phase.name} failed after ${duration}s: ${error.message}`);

      this.results[phaseId] = {
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      };

      throw error;
    }
  }

  async executeFullMigration(options = {}) {
    console.log('🚀 Starting Complete Migration Process');
    console.log('='.repeat(70));

    this.startTime = Date.now();

    try {
      // Prerequisites
      const prerequisitesValid = await this.validatePrerequisites();
      if (!prerequisitesValid) {
        throw new Error('Prerequisites validation failed');
      }

      // Backup
      if (!options.skipBackup) {
        await this.createBackup();
      }

      // Execute phases
      const phasesToExecute = options.phases || Object.keys(MIGRATION_PHASES);

      for (const phaseId of phasesToExecute) {
        await this.executePhase(phaseId, options);

        // Optional pause between phases
        if (
          options.pauseBetweenPhases &&
          phaseId !== phasesToExecute[phasesToExecute.length - 1]
        ) {
          console.log('\n⏸️  Pausing for manual verification...');

          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          await new Promise(resolve => {
            rl.question('Press Enter to continue to next phase...', () => {
              rl.close();
              resolve();
            });
          });
        }
      }

      this.printSummary();
    } catch (error) {
      this.log(`❌ Migration failed: ${error.message}`);
      console.error('\n💥 Migration failed!');
      console.error('Error:', error.message);

      console.log('\n🔄 Rollback options:');
      console.log('   1. Review the log file for details');
      console.log('   2. Run individual rollback scripts');
      console.log('   3. Use the backup to restore previous state');

      process.exit(1);
    }
  }

  printSummary() {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 Migration Process Completed!');
    console.log('📊 Summary:');

    let successCount = 0;
    let failureCount = 0;

    for (const [phaseId, result] of Object.entries(this.results)) {
      const phase = MIGRATION_PHASES[phaseId];
      const status = result.success ? '✅' : '❌';
      const duration = (result.duration / 1000).toFixed(2);
      const manual = result.manual ? ' (manual)' : '';

      console.log(`   ${status} ${phase.name}: ${duration}s${manual}`);

      if (result.success) {
        successCount++;
      } else {
        failureCount++;
        console.log(`      Error: ${result.error}`);
      }
    }

    console.log(`\n📈 Total phases: ${Object.keys(this.results).length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`⏱️  Total duration: ${totalDuration}s`);

    if (failureCount === 0) {
      console.log('\n🎊 All migration phases completed successfully!');
      console.log('🔄 Next steps:');
      console.log('   1. Verify content in Contentful web interface');
      console.log('   2. Test application functionality');
      console.log('   3. Monitor performance metrics');
      console.log('   4. Train content creators on new fields');
    }

    console.log(`\n📝 Full log available at: ${this.logFile}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const orchestrator = new MigrationOrchestrator();

  await orchestrator.initialize();

  if (args.length === 0) {
    console.log('Usage: node migration-orchestrator.cjs [command] [options]');
    console.log('');
    console.log('Commands:');
    console.log('  full                    Execute complete migration');
    console.log('  phase <id>              Execute specific phase');
    console.log('  list                    List all phases');
    console.log('  validate                Validate prerequisites only');
    console.log('');
    console.log('Options:');
    console.log('  --skip-backup          Skip pre-migration backup');
    console.log('  --skip-confirmation    Skip manual confirmations');
    console.log(
      '  --pause-between-phases Pause between phases for verification'
    );
    console.log('');
    console.log('Examples:');
    console.log('  node migration-orchestrator.cjs full');
    console.log('  node migration-orchestrator.cjs phase phase1');
    console.log(
      '  node migration-orchestrator.cjs full --skip-backup --pause-between-phases'
    );
    return;
  }

  const command = args[0];
  const options = {
    skipBackup: args.includes('--skip-backup'),
    skipConfirmation: args.includes('--skip-confirmation'),
    pauseBetweenPhases: args.includes('--pause-between-phases'),
  };

  switch (command) {
    case 'full':
      await orchestrator.executeFullMigration(options);
      break;

    case 'phase':
      const phaseId = args[1];
      if (!phaseId) {
        console.error('❌ Phase ID required');
        process.exit(1);
      }
      await orchestrator.executePhase(phaseId, options);
      break;

    case 'list':
      console.log('📋 Available migration phases:');
      for (const [id, phase] of Object.entries(MIGRATION_PHASES)) {
        const critical = phase.critical ? '🔴' : '🟡';
        const manual = phase.manual ? '📖' : '🤖';
        console.log(`   ${critical} ${manual} ${id}: ${phase.name}`);
        console.log(`      ${phase.description}`);
        console.log(`      Estimated time: ${phase.estimatedTime}`);
        console.log('');
      }
      break;

    case 'validate':
      await orchestrator.validatePrerequisites();
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Orchestrator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { MigrationOrchestrator, MIGRATION_PHASES };
