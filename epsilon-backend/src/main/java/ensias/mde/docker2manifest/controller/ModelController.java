package ensias.mde.docker2manifest.controller;

import ensias.mde.docker2manifest.controller.dto.ModelingDTO;
import ensias.mde.docker2manifest.service.ModelToModelService;
import ensias.mde.docker2manifest.service.ModelToTextService;
import org.eclipse.epsilon.emc.emf.InMemoryEmfModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/models")
public class ModelController {
    @Autowired
    private ModelToModelService modelToModelService;
    @Autowired
    private ModelToTextService modelToTextService;
    @PostMapping("/transform")
    public ResponseEntity<?> forwardEngineering(@RequestBody ModelingDTO modelingDTO) throws Exception {

        InMemoryEmfModel targetModel = modelToModelService
                .modelToModelTransformation(modelingDTO.getDockerCompose());
        String generatedConfigFile = modelToTextService
                .ModelToText(targetModel);
        return ResponseEntity.ok(generatedConfigFile);
    }
}

