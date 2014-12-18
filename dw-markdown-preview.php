<?php

/*
  Plugin Name: DW Markdown Preview
  Description: Provides a live preview of markdown entered (if jp-markdown is installed and activated)
  Author: Ryan Jarrett
  Version: 0.1
  Author URI: http://sparkdevelopment.co.uk

  Changelog
  ---------
  0.1   - initial release
*/

  if (!defined('ABSPATH')) {
    exit; // disable direct access
  }


  /**
   * Force plugin to load early
   *
   * @since 1.0
   */
      
  function DWMDP_load_last(){
    $path = str_replace( WP_PLUGIN_DIR . '/', '', __FILE__ );
    if ( $plugins = get_option( 'active_plugins' ) ) {
      if ( $key = array_search( $path, $plugins ) ) {
        array_splice( $plugins, $key, 1 );
        array_push( $plugins, $path );
        update_option( 'active_plugins', $plugins );
      }
    }
  }
  add_action( 'activated_plugin', 'DWMDP_load_last',1 );

  if (!class_exists('DWMDPreview')) {
    class DWMDPreview {

      /**
       * @var string
       */
      public $version = '0.1';

      /**
       * Define PageAPI constants
       *
       * @since 1.0
       */
      private function define_constants() {

       define('DWMDP_VERSION', $this->version);
       define('DWMDP_BASE_URL', trailingslashit(plugins_url('pageapi')));
       define('DWMDP_PATH', plugin_dir_path(__FILE__));

      }

      public function __construct() {

        // Checks to see if JP Markdown or Jetpack Markdown module is installed & enabled
        if (class_exists('WPCom_Markdown')) {
          add_action( 'admin_enqueue_scripts', array($this,'DWMDP_scripts') );
          add_filter( 'the_editor', array($this,'add_preview'), 0, 1 );
        } else {
          // JP Markdown not active
          add_action( 'admin_notices', array($this,'DWMDP_deactivated') );
        }

      }

      public function DWMDP_deactivated() {
          ?>
          <div class="error">
              <p><?php _e( 'Jetpack Markdown not installed/activated. DW Markdown Preview deactivated', 'my-text-domain' ); ?></p>
          </div>
          <?php
          deactivate_plugins( plugin_basename( __FILE__ ) );
      }

      public function add_preview($html) {
        $html .= "<div class='dwmd-preview-title'>Preview</div><iframe class='dwmd-preview'></iframe>";
        $html .= "<script type='text/javascript'>";
        $html .= "jQuery(function($) {";
        $html .= "var head = $('iframe').contents().find('head'); ";
        $html .= "head.append($('<link/>', { rel: 'stylesheet', href: '" . get_stylesheet_directory_uri() . "/style.css', type: 'text/css' }));";
        $html .= "});";
        $html .= "</script>";
        return $html;
      }

      public function DWMDP_scripts($hook) {
        if ( !in_array($hook,array('edit.php','post.php','post-new.php')) ) {
          return;
        }

        wp_enqueue_script( 'showdown', plugin_dir_url( __FILE__ ) . 'js/showdown.js', 'jquery' );
        wp_enqueue_script( 'dwmdp', plugin_dir_url( __FILE__ ) . 'js/dwmdp.js' );

        wp_enqueue_style( 'dwmdp', plugin_dir_url( __FILE__ ) . 'css/preview.css' );
      }

   }

   new DWMDPreview;

 }