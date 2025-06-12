<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  let responses: Record<string, string | string[]> = {};
  let formError: string | null = null;
  let submissionError: string | null = null;

  // Initialisation sécurisée des réponses
  $: if (data?.form?.questions) {
    responses = Object.fromEntries(
      data.form.questions.map(q => [
        q.questionId, 
        q.type === 'multiple' ? [] : ''
      ])
    );
  }

  async function submitForm() {
    submissionError = null;
    
    try {
      // Validation des champs requis
      const requiredQuestions = data.form.questions
        .filter(q => q.isRequired)
        .map(q => q.questionId);

      const missingAnswers = requiredQuestions.filter(id => 
        !responses[id] || 
        (Array.isArray(responses[id]) && responses[id].length === 0)
      );

      if (missingAnswers.length > 0) {
        throw new Error('Veuillez répondre aux questions obligatoires');
      }

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: data.form._id,
          answers: responses,
          submittedAt: new Date().toISOString()
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Échec de la soumission');
      }

      alert('Merci pour votre réponse !');
      goto('/');
    } catch (err) {
      console.error('Erreur:', err);
      submissionError = err.message;
    }
  }
</script>

{#if data.form}
  <div class="form-container">
    <h1>{data.form.title}</h1>
    {#if data.form.description}
      <p class="description">{data.form.description}</p>
    {/if}

    {#each data.form.questions as question (question.questionId)}
      <div class="question-block">
        <h3>
          {question.label}
          {#if question.isRequired}<span class="required">*</span>{/if}
        </h3>

        {#if question.type === 'single'}
          <div class="options-group">
            {#each question.options as option (option)}
              <label class="option">
                <input 
                  type="radio" 
                  name={question.questionId} 
                  value={option}
                  bind:group={responses[question.questionId]}
                />
                <span class="option-text">{option}</span>
              </label>
            {/each}
          </div>

        {:else if question.type === 'multiple'}
          <div class="options-group">
            {#each question.options as option (option)}
              <label class="option">
                <input 
                  type="checkbox" 
                  value={option}
                  bind:group={responses[question.questionId]}
                />
                <span class="option-text">{option}</span>
              </label>
            {/each}
          </div>

        {:else}
          <input
            type="text"
            class="text-input"
            placeholder="Votre réponse..."
            bind:value={responses[question.questionId]}
            aria-required={question.isRequired}
          />
        {/if}
      </div>
    {/each}

    {#if submissionError}
      <div class="error-message">{submissionError}</div>
    {/if}

    <button on:click={submitForm} class="submit-button">
      Soumettre
    </button>
  </div>
{:else}
  <div class="not-found">
    <p>Formulaire non trouvé</p>
    <button on:click={() => goto('/')}>Retour à l'accueil</button>
  </div>
{/if}

<style>
  .form-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .question-block {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .options-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 6px;
    background: #fff;
    transition: background 0.2s;
  }

  .option:hover {
    background: #f1f3f5;
  }

  .option-text {
    font-size: 0.95rem;
  }

  .text-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 1rem;
  }

  .required {
    color: #e63946;
    margin-left: 0.25rem;
  }

  .submit-button {
    display: block;
    width: 100%;
    padding: 1rem;
    background: #2a9d8f;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-button:hover {
    background: #21867a;
  }

  .error-message {
    color: #e63946;
    margin: 1rem 0;
    padding: 0.75rem;
    background: #ffe3e3;
    border-radius: 6px;
  }

  .not-found {
    text-align: center;
    padding: 2rem;
  }
</style>
