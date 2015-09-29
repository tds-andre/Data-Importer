<!--Templates-->
<?php include_once "components/start-transaction/template.html"; ?>
<?php include_once "components/dataset-list/template.html"; ?>
<?php include_once "components/dataset-list-item/template.html"; ?>
<?php include_once "components/dataset-details/template.html"; ?>
<?php include_once "components/dataset-create-update/template.html"; ?>
<?php include_once "components/transaction-create-update/template.html"; ?>



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

<div id="generic-modal" class="modal fade" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">Origem - Detalhes</h4>
                </div>

                <div class="modal-body">
                  
                    

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>                  
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
<script type="text/javascript" src="components/start-transaction/view.js"></script>
<script type="text/javascript" src="components/dataset-list/view.js"></script>
<script type="text/javascript" src="components/dataset-list-item/view.js"></script>
<script type="text/javascript" src="components/dataset-details/view.js"></script>
<script type="text/javascript" src="components/dataset-create-update/view.js"></script>
<script type="text/javascript" src="components/transaction-create-update/view.js"></script>


<!--App & Initialization-->
<script type="text/javascript" src="routes.js"></script>
<script type="text/javascript" src="app.js"></script>


