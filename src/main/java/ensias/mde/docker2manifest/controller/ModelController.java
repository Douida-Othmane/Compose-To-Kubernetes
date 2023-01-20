package ensias.mde.docker2manifest.controller;

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
    public ResponseEntity<?> forwardEngineering(@RequestBody String dockerCompose) throws Exception {
        String dkc = "<?nsuri compose?>\n" +
                "<compose version=\"1\">" +
                    "<service name=\"my-app\" image=\"node:latest\">\n" +
                        "<port host=\"80\" container=\"80\" />\n" +
                        "<volume name=\"my-volume\" container=\"/path/in/container\" />\n" +
                        "<environment name=\"PASSWORD\" value=\"test\" />\n" +
                    "</service>\n" +
                "</compose>";
        InMemoryEmfModel targetModel = modelToModelService
                .modelToModelTransformation(dkc);
        System.out.println("targetModel");
        String generatedConfigFile = modelToTextService
                .ModelToText(targetModel);
        System.out.println("generatedConfigFile");
        return ResponseEntity.ok(generatedConfigFile);
    }
}
