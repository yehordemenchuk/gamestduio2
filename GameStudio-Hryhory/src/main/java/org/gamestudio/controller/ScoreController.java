package org.gamestudio.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.gamestudio.dto.request.ScoreRequest;
import org.gamestudio.dto.response.ScoreResponse;
import org.gamestudio.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/scores/")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreService scoreService;

    @PostMapping
    public ResponseEntity<ScoreResponse> createScore(@Valid @RequestBody ScoreRequest scoreRequest) {
        ScoreResponse scoreResponse = scoreService.createScore(scoreRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(scoreResponse.id())
                .toUri();

        return ResponseEntity.created(location).body(scoreResponse);
    }

    @GetMapping("{id}")
    public ResponseEntity<ScoreResponse> findScoreById(@PathVariable long id) throws EntityNotFoundException {
        ScoreResponse scoreResponse = scoreService.findScoreById(id);

        return ResponseEntity.ok().body(scoreResponse);
    }

    @GetMapping("/top/{game}")
    public ResponseEntity<List<ScoreResponse>> findTopByGame(@PathVariable String game) {
        return ResponseEntity.ok().body(scoreService.findTopByGame(game));
    }

    @GetMapping
    public ResponseEntity<List<ScoreResponse>> findAllScores() {
        return ResponseEntity.ok().body(scoreService.findAllScores());
    }

    @PutMapping("{id}")
    public ResponseEntity<ScoreResponse> updateScore(@PathVariable long id,
                                                     @Valid @RequestBody ScoreRequest scoreRequest) {
        ScoreResponse scoreResponse = scoreService.updateScore(id, scoreRequest);

        return ResponseEntity.ok().body(scoreResponse);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteScoreById(@PathVariable long id) throws EntityNotFoundException {
        scoreService.deleteScoreById(id);

        return ResponseEntity.noContent().build();
    }
}
