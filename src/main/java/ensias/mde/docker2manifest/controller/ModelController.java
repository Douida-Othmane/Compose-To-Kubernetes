package ensias.mde.docker2manifest.controller;

import ensias.mde.docker2manifest.controller.dto.ModelingDTO;
import ensias.mde.docker2manifest.service.ModelToModelService;
import ensias.mde.docker2manifest.service.ModelToTextService;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ModelController {
    @Autowired
    private ModelToModelService modelToModelService;
    @Autowired
    private ModelToTextService modelToTextService;
    @PostMapping("/transform")
    public ResponseEntity<?> forwardEngineering(@RequestBody ModelingDTO modelingDTO) throws Exception {
        InMemoryEmfModel targetModel = modelToModelService
                .modelToModelTransformation(modelingDTO.getDockerCompose(), modelingDTO.getManifestK8S());
        String generatedConfigFile = modelToTextService
                .ModelToText(targetModel, modelingDTO.getManifestK8S());
        return ResponseEntity.ok(generatedConfigFile);
    }
}
