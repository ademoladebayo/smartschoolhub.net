<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    protected $subject_registration_colunms = ['note_assignment', 'cbt', 'project'];

    public function up()
    {
        // activity_log
        if (!Schema::hasTable('activity_log')) {
            Schema::create('activity_log', function (Blueprint $table) {
                $table->id();
                $table->string('user', 45);
                $table->string('request', 500);
                $table->string('response', 1000);
                $table->string('date', 45);
                $table->string('date_time', 45);
                //$table->engine = 'MyISAM';
            });
        }

        // admin
        if (!Schema::hasTable('admin')) {
            Schema::create('admin', function (Blueprint $table) {
                $table->id();
                $table->string('username', 45);
                $table->string('password', 45);
                $table->string('device_token', 255)->nullable();
            });
        }

        // assignment
        if (!Schema::hasTable('assignment')) {
            Schema::create('assignment', function (Blueprint $table) {
                $table->id();
                $table->string('subject_id', 45);
                $table->string('topic', 200);
                $table->mediumText('content');
                $table->string('status', 45)->default('OPEN');
                $table->string('date', 45);
                $table->string('session', 45);
                $table->string('term', 45);
                $table->string('mark_obtainable', 3);
            });
        }

        // assignment_submission
        if (!Schema::hasTable('assignment_submission')) {
            Schema::create('assignment_submission', function (Blueprint $table) {
                $table->id();
                $table->string('assignment_id', 45);
                $table->string('student_id', 45);
                $table->mediumText('content');
                $table->string('score', 45)->default('0');
                $table->string('date', 45);
                $table->string('graded', 5)->default('FALSE');
            });
        }

        // bursary
        if (!Schema::hasTable('bursary')) {
            Schema::create('bursary', function (Blueprint $table) {
                $table->id();
                $table->string('username', 45);
                $table->string('password', 45);
                $table->string('device_token', 255)->nullable();
            });
        }

        // cbt
        if (!Schema::hasTable('cbt')) {
            Schema::create('cbt', function (Blueprint $table) {
                $table->id();
                $table->string('cbt_title', 45);
                $table->string('cbt_date', 45);
                $table->string('cbt_status', 45)->default('CLOSE');
                $table->string('start_time', 45);
                $table->string('cbt_duration', 45);
                $table->mediumText('cbt_instruction');
                $table->mediumText('cbt_question');
                $table->mediumText('cbt_options');
                $table->mediumText('cbt_answer');
                $table->mediumText('cbt_questions_number');
                $table->string('subject_id', 45);
                $table->string('class_id', 45);
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // cbt_result
        if (!Schema::hasTable('cbt_result')) {
            Schema::create('cbt_result', function (Blueprint $table) {
                $table->id();
                $table->string('cbt_id', 45);
                $table->string('student_id', 45);
                $table->string('score', 45);
                $table->mediumText('answer');
            });
        }

        // class
        if (!Schema::hasTable('class')) {
            Schema::create('class', function (Blueprint $table) {
                $table->id();
                $table->string('class_name', 512);
                $table->string('class_sector', 45);
                $table->string('class_teacher', 512);
            });
        }

        // control_panel
        if (!Schema::hasTable('control_panel')) {
            Schema::create('control_panel', function (Blueprint $table) {
                $table->id();
                $table->string('access_result', 45)->default('OFF');
                $table->string('register_subject', 45)->default('OFF');
                $table->string('check_debitors', 45)->default('0-OFF');
                $table->string('max_resumption_time', 45)->default('8-OFF');
                $table->string('debitor_list_last_update', 100)->default('-');
                //$table->engine = 'MyISAM';
            });
        }

        // debitors
        if (!Schema::hasTable('debitors')) {
            Schema::create('debitors', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->integer('amount')->default(0);
                $table->string('last_checked', 255);
                //$table->engine = 'MyISAM';
            });
        }

        // expense
        if (!Schema::hasTable('expense')) {
            Schema::create('expense', function (Blueprint $table) {
                $table->id();
                $table->string('description', 45);
                $table->string('date_incurred', 45);
                $table->string('amount', 45);
                $table->string('last_modified', 45);
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // fee
        if (!Schema::hasTable('fee')) {
            Schema::create('fee', function (Blueprint $table) {
                $table->id();
                $table->string('description', 45);
                $table->string('type', 45);
                $table->integer('amount');
                $table->string('class', 45);
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // grade_settings
        if (!Schema::hasTable('grade_settings')) {
            Schema::create('grade_settings', function (Blueprint $table) {
                $table->id();
                $table->integer('min');
                $table->integer('max');
                $table->string('grade', 45);
                $table->string('remark', 45);
            });
        }

        // inventory
        if (!Schema::hasTable('inventory')) {
            Schema::create('inventory', function (Blueprint $table) {
                $table->id();
                $table->string('item', 45);
                $table->string('description', 45);
                $table->string('quantity', 45);
                $table->string('date_created', 45);
                $table->string('last_modified', 45);
            });
        }

        // lesson_plan
        if (!Schema::hasTable('lesson_plan')) {
            Schema::create('lesson_plan', function (Blueprint $table) {
                $table->id();
                $table->string('subject_id', 45)->nullable();
                $table->string('week', 255)->nullable();
                $table->mediumText('instructional_material')->nullable();
                $table->mediumText('previous_knowledge')->nullable();
                $table->mediumText('previous_lesson')->nullable();
                $table->mediumText('behavioural_objective')->nullable();
                $table->mediumText('content')->nullable();
                $table->mediumText('presentation')->nullable();
                $table->mediumText('evaluation')->nullable();
                $table->mediumText('conclusion')->nullable();
                $table->mediumText('assignment')->nullable();
                $table->string('term', 255)->nullable();
                $table->string('status', 45)->default('NO STATUS');
                //$table->engine = 'MyISAM';
            });
        }

        // live_class
        if (!Schema::hasTable('live_class')) {
            Schema::create('live_class', function (Blueprint $table) {
                $table->id();
                $table->string('live_id', 45);
                $table->string('subject_id', 45);
                $table->string('class_id', 45);
                $table->string('topic', 45);
                $table->string('date', 45);
                $table->string('time', 45);
                $table->string('status', 45)->default('NOT LIVE');
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // notes
        if (!Schema::hasTable('notes')) {
            Schema::create('notes', function (Blueprint $table) {
                $table->id();
                $table->string('subject_id', 45);
                $table->string('topic', 200);
                $table->mediumText('content')->nullable();
                $table->string('date', 45);
                //$table->engine = 'MyISAM';
            });
        }

        // online_payment
        if (!Schema::hasTable('online_payment')) {
            Schema::create('online_payment', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('class_id', 45);
                $table->string('amount', 45);
                $table->string('date', 45);
                $table->string('transaction_status', 45);
                $table->string('reference_id', 45);
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // optional_fee_request
        if (!Schema::hasTable('optional_fee_request')) {
            Schema::create('optional_fee_request', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('fee_id', 45);
                $table->string('session', 45);
                $table->string('term', 45);
                $table->tinyInteger('approved')->default(0);
                //$table->engine = 'MyISAM';
            });
        }

        // payment_history
        if (!Schema::hasTable('payment_history')) {
            Schema::create('payment_history', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('class_id', 45);
                $table->string('payment_type', 45);
                $table->string('fee_type', 45)->default('COMPULSORY');
                $table->string('payment_description', 255)->default('TUITION FEE');
                $table->integer('amount');
                $table->string('date', 45);
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // personal_access_tokens
        if (!Schema::hasTable('personal_access_tokens')) {
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('tokenable_type', 255);
                $table->unsignedBigInteger('tokenable_id');
                $table->string('name', 255);
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamps();

                $table->index(['tokenable_type', 'tokenable_id']);
            });
        }

        // portal_subscription
        if (!Schema::hasTable('portal_subscription')) {
            Schema::create('portal_subscription', function (Blueprint $table) {
                $table->id();
                $table->string('subscription_id', 45)->nullable();
                $table->string('description', 45)->nullable();
                $table->string('status', 45)->nullable();
                $table->string('amount', 45)->nullable();
                //$table->engine = 'MyISAM';
            });
        }

        // school_details
        if (!Schema::hasTable('school_details')) {
            Schema::create('school_details', function (Blueprint $table) {
                $table->id();
                $table->string('school_name', 255);
                $table->string('school_address', 255);
                $table->string('school_phone', 45);
                $table->string('school_email', 45);
                $table->string('school_color', 45);
                $table->string('subscription_fee', 45)->default('0');
            });
        }

        // session
        if (!Schema::hasTable('session')) {
            Schema::create('session', function (Blueprint $table) {
                $table->id();
                $table->string('session', 45);
                $table->string('term', 45);
                $table->string('session_status', 45);
            });
        }

        // student
        if (!Schema::hasTable('student')) {
            Schema::create('student', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45)->nullable();
                $table->string('first_name', 512);
                $table->string('middle_name', 512);
                $table->string('last_name', 512);
                $table->string('gender', 512);
                $table->string('religion', 512);
                $table->string('dob', 512);
                $table->string('joining_date', 512);
                $table->string('home_address', 512);
                $table->string('state', 512);
                $table->string('image_url', 512)->default('/no-image');
                $table->string('class', 512);
                $table->string('guardian_name', 512);
                $table->string('guardian_phone', 512);
                $table->string('guardian_email', 512);
                $table->string('guardian_address', 512);
                $table->string('profile_status', 45);
                $table->string('can_access_transcript', 45)->default('YES');
                $table->string('password', 300);
                $table->string('graduation', 45)->default('-');
                $table->string('guardian_pass', 45)->default('-');
                $table->string('device_token', 255)->nullable();
                $table->string('guardian_device_token', 255)->nullable();
            });
        }

        // student_attendance
        if (!Schema::hasTable('student_attendance')) {
            Schema::create('student_attendance', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('class_id', 45);
                $table->string('date', 45);
                $table->string('time_in', 45);
                $table->string('time_out', 45)->default('-');
                $table->string('term', 45);
                $table->string('session', 45);
            });
        }

        // student_result_comment
        if (!Schema::hasTable('student_result_comment')) {
            Schema::create('student_result_comment', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('class_teacher_comment', 255)->default('-');
                $table->string('principal_comment', 255)->default('-');
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // student_result_rating
        if (!Schema::hasTable('student_result_rating')) {
            Schema::create('student_result_rating', function (Blueprint $table) {
                $table->id();
                $table->string('student_id', 45);
                $table->string('handwriting', 45)->default('5');
                $table->string('fluency', 45)->default('5');
                $table->string('games', 45)->default('5');
                $table->string('sport', 45)->default('5');
                $table->string('handling_tools', 45)->default('5');
                $table->string('drawing_painting', 45)->default('5');
                $table->string('musical_skill', 45)->default('5');
                $table->string('neatness', 45)->default('5');
                $table->string('politeness', 45)->default('5');
                $table->string('cooperation', 45)->default('5');
                $table->string('leadership', 45)->default('5');
                $table->string('helping_others', 45)->default('5');
                $table->string('health', 45)->default('5');
                $table->string('attitude', 45)->default('5');
                $table->string('perseverance', 45)->default('5');
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // subject_registration
        if (!Schema::hasTable('subject_registration')) {
            Schema::create('subject_registration', function (Blueprint $table) {
                $table->id();
                $table->string('subject_id', 45);
                $table->string('student_id', 45);
                $table->string('subject_type', 45);
                $table->string('term', 45);
                $table->string('session', 45);
                $table->string('class_id', 45);
                $table->string('first_ca', 45)->default('-');
                $table->string('second_ca', 45)->default('-');
                $table->string('examination', 45)->default('-');
                $table->integer('total')->default(0);
                $table->string('grade', 45)->default('-');
                $table->string('remark', 45)->default('-');
            });
        }

        // teacher
        if (!Schema::hasTable('teacher')) {
            Schema::create('teacher', function (Blueprint $table) {
                $table->id();
                $table->string('teacher_id', 45)->nullable();
                $table->string('title', 512);
                $table->string('first_name', 512);
                $table->string('middle_name', 512);
                $table->string('last_name', 512);
                $table->string('gender', 512);
                $table->string('religion', 512);
                $table->string('dob', 512);
                $table->string('phone', 512);
                $table->string('email', 512);
                $table->string('joining_date', 512);
                $table->string('home_address', 512);
                $table->string('state', 512);
                $table->string('image_url', 512)->default('/no-image');
                $table->string('assigned_class', 512)->default('-');
                $table->string('profile_status', 45);
                $table->string('password', 500);
                $table->string('device_token', 255)->nullable();
            });
        }

        // subject
        if (!Schema::hasTable('subject')) {
            Schema::create('subject', function (Blueprint $table) {
                $table->id();
                $table->string('subject_name', 512);
                $table->string('class', 512);
                $table->unsignedBigInteger('teacher');

                $table->foreign('teacher')->references('id')->on('teacher');
            });
        }

        // teacher_attendance
        if (!Schema::hasTable('teacher_attendance')) {
            Schema::create('teacher_attendance', function (Blueprint $table) {
                $table->id();
                $table->string('teacher_id', 45);
                $table->string('date', 45);
                $table->string('time_in', 45);
                $table->string('time_out', 45)->default('-');
                $table->string('session', 45);
                $table->string('term', 45);
            });
        }

        // uploads
        if (!Schema::hasTable('uploads')) {
            Schema::create('uploads', function (Blueprint $table) {
                $table->id();
                $table->string('subject_id', 45);
                $table->string('upload_type', 45);
                $table->string('url', 500);
                $table->string('date', 45);
                //$table->engine = 'MyISAM';
            });
        }


        if (!Schema::hasColumn('teacher', 'qualification')) {
            Schema::table('teacher', function (Blueprint $table) {
                $table->string('qualification')->default('-')->after('email');
            });
        }


        $after = 'second_ca';
        foreach ($this->subject_registration_colunms as $colunm) {

            if (!Schema::hasColumn('subject_registration', $colunm)) {
                Schema::table('subject_registration', function (Blueprint $table, $colunm, $after) {
                    $table->string($colunm)->default('-')->after($after);
                });
                $after = $colunm;
            }
        }

        $tables = DB::select('SHOW TABLES');

        foreach ($tables as $table) {
            $tableName = reset($table);

            // Skip migrations table
            if ($tableName === 'migrations') {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                if (!Schema::hasColumn($table->getTable(), 'created_at')) {
                    $table->timestamp('created_at')->nullable();
                }

                if (!Schema::hasColumn($table->getTable(), 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }

                if (!Schema::hasColumn($table->getTable(), 'deleted_at')) {
                    $table->timestamp('deleted_at')->nullable();
                }
            });

            // Update existing records with current timestamps
            if (Schema::hasColumn($tableName, 'created_at')) {
                DB::table($tableName)->whereNull('created_at')->update(['created_at' => now()]);
            }

            if (Schema::hasColumn($tableName, 'updated_at')) {
                DB::table($tableName)->whereNull('updated_at')->update(['updated_at' => now()]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop tables in reverse order to respect foreign key constraints
        Schema::dropIfExists('uploads');
        Schema::dropIfExists('teacher_attendance');
        Schema::dropIfExists('subject_registration');
        Schema::dropIfExists('subject');
        Schema::dropIfExists('teacher');
        Schema::dropIfExists('student_result_rating');
        Schema::dropIfExists('student_result_comment');
        Schema::dropIfExists('student_attendance');
        Schema::dropIfExists('student');
        Schema::dropIfExists('session');
        Schema::dropIfExists('school_details');
        Schema::dropIfExists('portal_subscription');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('payment_history');
        Schema::dropIfExists('optional_fee_request');
        Schema::dropIfExists('online_payment');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('live_class');
        Schema::dropIfExists('lesson_plan');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('grade_settings');
        Schema::dropIfExists('fee');
        Schema::dropIfExists('expense');
        Schema::dropIfExists('debitors');
        Schema::dropIfExists('control_panel');
        Schema::dropIfExists('class');
        Schema::dropIfExists('cbt_result');
        Schema::dropIfExists('cbt');
        Schema::dropIfExists('bursary');
        Schema::dropIfExists('assignment_submission');
        Schema::dropIfExists('assignment');
        Schema::dropIfExists('admin');
        Schema::dropIfExists('activity_log');

        if (Schema::hasColumn('teacher', 'qualification')) {
            Schema::table('teacher', function (Blueprint $table, $colunm) {
                $table->dropColumn('qualification');
            });
        }

        foreach ($this->subject_registration_colunms as $colunm) {
            if (Schema::hasColumn($colunm, 'subject_registration')) {
                Schema::table('subject_registration', function (Blueprint $table, $colunm) {
                    $table->dropColumn($colunm);
                });
            }
        }
    }
}