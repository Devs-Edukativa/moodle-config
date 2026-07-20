<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace mod_simplecertificate\event;

defined('MOODLE_INTERNAL') || die();

/**
 * The mod_simplecertificate certificate issued event class.
 *
 * Fired when a certificate is issued to a user.
 *
 * @package    mod_simplecertificate
 * @author     Carlos Alexandre S. da Fonseca
 * @copyright  2015 - Carlos Alexandre S. da Fonseca
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class certificate_issued extends \core\event\base {

    /**
     * Init method.
     *
     * @return void
     */
    protected function init() {
        $this->data['crud'] = 'c'; // c(reate), r(ead), u(pdate), d(elete).
        $this->data['edulevel'] = self::LEVEL_PARTICIPATING;
        $this->data['objecttable'] = 'simplecertificate_issues';
    }

    /**
     * Returns localised event name.
     *
     * @return string
     */
    public static function get_name() {
        return get_string('eventcertificate_issued', 'simplecertificate');
    }

    /**
     * Returns non-localised event description with id's for admin use only.
     *
     * @return string
     */
    public function get_description() {
        return get_string('eventcertificate_issued_description', 'simplecertificate', [
            'userid'          => $this->userid,
            'relateduserid'   => $this->relateduserid,
            'certificateid'   => $this->other['certificateid'] ?? '',
            'courseid'        => $this->other['courseid'] ?? '',
            'code'            => $this->other['code'] ?? '',
        ]);
    }

    /**
     * Get URL related to the action.
     *
     * @return \moodle_url
     */
    public function get_url() {
        return new \moodle_url('/mod/simplecertificate/view.php',
            ['id' => $this->contextinstanceid]);
    }

    /**
     * Custom validation.
     *
     * @throws \coding_exception
     * @return void
     */
    protected function validate_data() {
        parent::validate_data();

        if (empty($this->relateduserid)) {
            throw new \coding_exception('The \'relateduserid\' must be set.');
        }

        if (!isset($this->other['certificateid'])) {
            throw new \coding_exception('The \'certificateid\' value must be set in other.');
        }

        if (!isset($this->other['courseid'])) {
            throw new \coding_exception('The \'courseid\' value must be set in other.');
        }

        if (!isset($this->other['code'])) {
            throw new \coding_exception('The \'code\' value must be set in other.');
        }
    }

    /**
     * Return mapping of object related to this event.
     *
     * @return array
     */
    public static function get_objectid_mapping() {
        return ['db' => 'simplecertificate_issues', 'restore' => 'simplecertificate_issues'];
    }

    /**
     * Return mapping of other fields.
     *
     * @return array
     */
    public static function get_other_mapping() {
        return [
            'certificateid' => ['db' => 'simplecertificate', 'restore' => 'simplecertificate'],
            'courseid'      => ['db' => 'course', 'restore' => 'course'],
        ];
    }
}
