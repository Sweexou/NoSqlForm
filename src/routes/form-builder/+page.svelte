<script lang="ts">
  import { goto } from '$app/navigation';

  type QuestionType = 'short' | 'single' | 'multiple';

  interface Question {
    text: string;
    type: QuestionType;
    options: string[];
    required: boolean;
  }

  let formName: string = "Forms name";
  let formDescription: string = "Description du formulaire";
  let questions: Question[] = [];

  const types: { value: QuestionType; label: string }[] = [
    { value: 'short', label: 'Short Answer' },
    { value: 'single', label: 'Single Choice' },
    { value: 'multiple', label: 'Multiple Choice' }
  ];

  function addQuestion(): void {
    questions = [
      ...questions,
      {
        text: '',
        type: 'short',
        options: ['Option 1'],
        required: true
      }
    ];
  }

  function removeQuestion(idx: number): void {
    questions = questions.filter((_, i) => i !== idx);
  }

  function addOption(qIdx: number): void {
    questions[qIdx].options = [...questions[qIdx].options, `Option ${questions[qIdx].options.length + 1}`];
  }

  function removeOption(qIdx: number, oIdx: number): void {
    if (questions[qIdx].options.length > 1) {
      questions[qIdx].options = questions[qIdx].options.filter((_, i) => i !== oIdx);
    }
  }

  function shareForm(): void {
    alert('Share functionality coming soon!');
  }

  // Drag and drop functionality
  let draggedIndex: number | null = null;

  function handleDragStart(event: DragEvent, index: number): void {
    draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const draggedQuestion = questions[draggedIndex];
      const newQuestions = [...questions];
      newQuestions.splice(draggedIndex, 1);
      const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
      newQuestions.splice(insertIndex, 0, draggedQuestion);
      questions = newQuestions;
    }
    draggedIndex = null;
  }

  async function saveForm() {
  const formToSave = {
    title: formName,
    description: formDescription,
    createdAt: new Date(),
    questions: questions.map(q => ({
      questionId: crypto.randomUUID(),
      type: q.type === 'short' ? 'open' : q.type,
      label: q.text,
      options: (q.type === 'single' || q.type === 'multiple') ? q.options : [],
      isRequired: q.required
    }))
  };

  const res = await fetch('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formToSave)
  });

  if (res.ok) {
    alert("Form saved!");
  } else {
    alert("Error saving form");
  }
}

</script>

<div class="page-bg">
  <!-- Header with back button, form name, and share button -->
  <header class="main-header">
    <div class="header-content">
      <a class="back-btn" href="/forms-home" aria-label="Back to Home">← Home</a>
      <div class="header-title">{formName}</div>
      <button class="share-btn" on:click={shareForm}>Share Form</button>
    </div>
  </header>

  <!-- Form card under header -->
  <div class="form-card">
    <input
      class="form-card-title"
      type="text"
      bind:value={formName}
      aria-label="Form name"
    />
    <input
      class="form-card-desc"
      type="text"
      bind:value={formDescription}
      aria-label="Form description"
    />
    <button class="save-btn" on:click={saveForm}>Save</button>
  </div>

  <main>
    <div class="add-question-container">
      <button class="add-question-btn" on:click={addQuestion}>Add Question</button>
    </div>

    {#each questions as question, qIdx}
      <div 
        class="question-card"
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, qIdx)}
        on:dragover={handleDragOver}
        on:drop={(e) => handleDrop(e, qIdx)}
      >
        <!-- Drag handle -->
        <div class="drag-handle">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="4" cy="4" r="1.5" fill="#9aa0a6"/>
            <circle cx="4" cy="9" r="1.5" fill="#9aa0a6"/>
            <circle cx="4" cy="14" r="1.5" fill="#9aa0a6"/>
            <circle cx="9" cy="4" r="1.5" fill="#9aa0a6"/>
            <circle cx="9" cy="9" r="1.5" fill="#9aa0a6"/>
            <circle cx="9" cy="14" r="1.5" fill="#9aa0a6"/>
          </svg>
        </div>

        <div class="question-content">
          <div class="question-row">
            <input
              type="text"
              placeholder="Question title"
              bind:value={question.text}
              class="q-title"
            />
            <select bind:value={question.type} class="q-type">
              {#each types as t}
                <option value={t.value}>{t.label}</option>
              {/each}
            </select>
          </div>

          {#if question.type === 'single' || question.type === 'multiple'}
            <div class="options-list">
              {#each question.options as option, oIdx}
                <div class="option-item">
                  {#if question.type === 'single'}
                    <input type="radio" disabled />
                  {:else}
                    <input type="checkbox" disabled />
                  {/if}
                  <input
                    type="text"
                    class="option-input"
                    bind:value={question.options[oIdx]}
                    placeholder={`Option ${oIdx + 1}`}
                  />
                  <button
                    class="option-remove"
                    type="button"
                    on:click={() => removeOption(qIdx, oIdx)}
                    disabled={question.options.length <= 1}
                    aria-label="Remove option"
                  >×</button>
                </div>
              {/each}
              <button type="button" class="add-option-btn" on:click={() => addOption(qIdx)}>
                Add Option
              </button>
            </div>
          {:else}
            <input
              type="text"
              maxlength="255"
              class="short-answer-placeholder"
              placeholder="Short answer (max 255 characters)"
              disabled
            />
          {/if}

          <div class="question-actions-row">
            <label class="switch-label">
              Required
              <input type="checkbox" bind:checked={question.required} class="switch" />
              <span class="slider"></span>
            </label>
            <button
              type="button"
              class="remove-question-btn-inline"
              on:click={() => removeQuestion(qIdx)}
              aria-label="Delete"
            >×</button>
          </div>
        </div>
      </div>
    {/each}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .page-bg {
    background: #eaf2fb;
    min-height: 100vh;
    padding: 0;
  }
  .main-header {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px #b7b7c933;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    gap: 1.5rem;
  }
  .back-btn {
    color: #7b5cff;
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: none;
    padding: 0.4rem 1.1rem 0.4rem 0.2rem;
    border-radius: 5px;
    transition: background 0.15s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .back-btn:hover {
    background: #ece6fa;
    text-decoration: underline;
  }
  .header-title {
    font-size: 1.8rem;
    font-weight: 500;
    color: #3c2e5a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    flex: 1;
    text-align: center;
  }
  .share-btn {
    background: #7b5cff;
    color: #fff;
    border: none;
    padding: 0.6rem 1.8rem;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .share-btn:hover {
    background: #5d44b8;
  }
  .form-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px #b7b7c933;
    border: 2.5px solid #6a1b9a;
    margin: 0 auto 2.5rem auto;
    margin-top: 3vh;
    max-width: 900px;
    padding: 2.5rem 2.5rem 1.5rem 2.5rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .form-card-title {
    font-size: 2.2rem;
    font-weight: bold;
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    color: #222;
    margin-bottom: 1.1rem;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .form-card-desc {
    font-size: 1.1rem;
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    color: #757575;
    margin-bottom: 0.7rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.7rem;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .save-btn {
    margin-top: 1.2rem;
    background: #7b5cff;
    color: #fff;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .save-btn:hover {
    background: #5d44b8;
  }
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }
  .add-question-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  .add-question-btn {
    background: #ece6fa;
    color: #5d44b8;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .add-question-btn:hover {
    background: #d6c7f7;
  }
  .question-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px #b7b7c933;
    margin-bottom: 2rem;
    border: 1px solid #e0d7f3;
    display: flex;
    align-items: flex-start;
    cursor: move;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .question-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px #b7b7c955;
  }
  .drag-handle {
    padding: 1rem 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    border-right: 1px solid #f0f0f0;
  }
  .drag-handle:active {
    cursor: grabbing;
  }
  .question-content {
    flex: 1;
    padding: 2rem 2rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .question-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .q-title {
    flex: 1;
    font-size: 1.1rem;
    padding: 0.4rem 0.6rem;
    border: none;
    border-bottom: 2px solid #cfc0f7;
    background: transparent;
    outline: none;
    margin-bottom: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .q-title:focus {
    border-bottom: 2px solid #7b5cff;
  }
  .q-type {
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #cfc0f7;
    background: #f6f3fb;
    color: #4a3c6e;
    padding: 0.3rem 0.7rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .options-list {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .option-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 1rem;
  }
  .option-input {
    border: none;
    border-bottom: 1px solid #cfc0f7;
    background: transparent;
    font-size: 1rem;
    padding: 0.2rem 0.5rem;
    outline: none;
    width: 350px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .option-input:focus {
    border-bottom: 1.5px solid #7b5cff;
  }
  .option-remove {
    background: transparent;
    border: none;
    color: #555;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.5rem;
    line-height: 1;
    transition: color 0.15s;
  }
  .option-remove:hover {
    color: #c0392b;
  }
  .add-option-btn {
    background: none;
    color: #5d44b8;
    border: none;
    font-size: 0.98rem;
    cursor: pointer;
    margin-left: 1.7rem;
    margin-top: 0.2rem;
    padding: 0;
    text-decoration: underline;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .short-answer-placeholder {
    border: none;
    border-bottom: 1px solid #cfc0f7;
    background: transparent;
    color: #999;
    font-size: 1rem;
    padding: 0.2rem 0.5rem;
    width: 100%;
    max-width: 600px;
    margin-top: 0.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .question-actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }
  .switch-label {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #5d44b8;
    gap: 0.7rem;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .switch {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
  .slider {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    background: #7b5cff;
    border-radius: 12px;
    margin-left: 0.5rem;
    transition: background 0.2s;
  }
  .switch:not(:checked) + .slider {
    background: #ddd;
  }
  .slider:before {
    content: "";
    position: absolute;
    left: 3px;
    top: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s;
  }
  .switch:checked + .slider:before {
    transform: translateX(16px);
  }
  .remove-question-btn-inline {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ffeaea;
    color: #c0392b;
    border: none;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px #c0392b22;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .remove-question-btn-inline:hover {
    background: #ffcccc;
    color: #a82319;
  }
</style>
