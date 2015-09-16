<!--Templates-->
<?php include_once "components/transaction-list/template.html"; ?>
<?php include_once "components/transaction-item/template.html"; ?>
<?php include_once "components/start-transaction/template.html"; ?>
<?php include_once "components/new-dataset/template.html"; ?>


<div id="validation-modal" class="modal modal-message fade" style="display: none;" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <i class="fa"></i>
            </div>
            <div class="modal-title"></div><!--fa-warning-->

            <div class="modal-body">								
			</div>
			
            <div class="modal-footer">
                <button type="button" class="btn" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>


<!--Libraries-->
<script src="vendor/underscore/underscore-min.js" type="text/javascript"></script>
<script src="vendor/backbone/backbone-min.js" type="text/javascript"></script>
<script src="vendor/jfeldstein/jQuery.AjaxFileUpload.js/jQuery.AjaxFileUpload.js" type="text/javascript"></script>

<!--Groundwork-->
<script type="text/javascript" src="config.js"></script>
<script type="text/javascript" src="models.js"></script>

<!--Views-->
<script type="text/javascript" src="components/transaction-item/view.js"></script>
<script type="text/javascript" src="components/transaction-list/view.js"></script>
<script type="text/javascript" src="components/start-transaction/view.js"></script>
<script type="text/javascript" src="components/new-dataset/view.js"></script>

<!--App & Initialization-->
<script type="text/javascript" src="app.js"></script>
<script type="text/javascript" src="init.js"></script>